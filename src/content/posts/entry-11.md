---
title: Entry [11]
date: 2026-06-17
description: Continuing the Gossip Glomers challenge — implementing fault tolerance in a distributed broadcast system using Go goroutines, RPC, and ticker-based retry logic.
tags: [go, distributed-systems, maelstrom, gossip-glomers]
draft: false
---

To the surprise of maybe everyone,
especially me,
I'm still going strong with this challenge.

And I'm having a ton of fun.
Not putting pressure on it and letting myself _learn_
instead of trying to rush through the challenges,
makes it a lot different than how I usually approach these things.

So, onto the next part.

# Fault Tolerance
In this entry, we'll be building a _fault tolerant_ system.
Which is a system that persists, even in the face of chaos.
Or with a bit less melodrama, even if shit hits the fan,
our system will carry on, doing its job,
without losing data or duplicating anything.
Performance loss is a net negative, so we are also
having none of that!

In our case, the fault in our sta... ehm, system
is network partitions.
This means that even in the face of network disruptions,
our system needs to run and retain all of the data that has been sent.

# Preparations
I started all of this with the goal of learning design systems
and the principles behind them.
And what I've done so far is use Claude Code
to help me with that. But this all took a new level
after I found this repo -
[AI Agent Guidelines for CS336 at Stanford](https://github.com/stanford-cs336/assignment1-basics/blob/main/CLAUDE.md).
The Claude file for Stanford's CS curriculum.
It's setup in a way to force Claude to help
and guide students, without giving them
ready solutions.
If they get too stuck, it points them to
their professors.
Which is more than perfect. It's amazing really.

Now all i really have to do is give it what i am stuck on.
From there, it gives me pointers, suggestions and tells me
what to look up. But it doesn't give me a single line of code.
After I'm done, I ask it to review and it does.

So, on we go.

# Changes
I explained what I'm doing,
I explained how I am approaching learning.
Now lets get to it.

So, how do we handle fault tolerance?
Remember how we saved all the messages
that were already sent by our system and
checked against them before sending again,
in order to avoid sending unnecessary data?
We do the same thing, but instead of checking
if the message has already been sent, etc. etc.,
we delete it after we received a response.

First, we go and add the new map we'll use to store
all pending messages, along with 2 functions to add/delete
from the map:
```go
var (
  pending_mu sync.RWMutex
  pending    = make(map[string][]float64)
)

// Add
func add_pending(neighbor string, msg float64) {
  pending_mu.Lock()
  defer pending_mu.Unlock()
  pending[neighbor] = append(pending[neighbor], msg)
}

func delete_pending(neighbor string, msg float64) {
  pending_mu.Lock()
  defer pending_mu.Unlock()
  msgs := pending[neighbor]
  for i, m := range msgs {
    if m == msg {
      pending[neighbor] = append(msgs[:i], msgs[i+1:]...)
      return
    }
  }
}
```

We then also change how the messages are being sent.
Up until now, we've used the `Send()` method of the
maelstrom package. But that's no good any longer.
Here is why:

`Send sends a message body to a given destination node.`

This sends, but doesn't care about the response. They even mention it in the beginning:

```Send() sends a fire-and-forget message and doesn't expect a response. As such, it does not attach a message ID.```

This won't work for us. As we need to know if
the message was received or not.
So we'll now use *drums please*:
```RPC() sends a message and accepts a response handler. The message will be decorated with a message ID so the handler can be invoked when a response message is received.```

This now allows us to add the message to pending ->
send it -> Wait for it -> delete once we get a response.

So we turn this

```go
    if !seen {
      add(body.Message)
      for _, nh := range neighbours {
        if err := n.Send(nh, BroadcastMessage{
          Type:    "broadcast",
          Message: body.Message,
        }); err != nil {
          return err
        }
      }
    }
```
into this

```go
    if !seen {
      add_messages(body.Message)
      for _, nh := range neighbours {
        add_pending(nh, body.Message)
        if err := n.RPC(nh, BroadcastMessage{
          Type:    "broadcast",
          Message: body.Message,
        }, func(msg maelstrom.Message) error {
          delete_pending(nh, body.Message)
          return nil
        }); err != nil {
          log.Println("Failed something. ", err.Error())
        }
      }
    }
```
We now wait to get the message and if we don't,
it's not removed from the pending map.

So we now store all messages that we send
and remove the ones that have been received.
But what now? How do we get all missed messages
to the nodes that didn't get them?

# Concurrency

I'm happy to introduce you to our next guest - *Goroutines*!
Lightweight (or green) threads, managed by the Go runtime,
that allow us to enter the world of concurrency.

With these little helpers, we can start an execution loop
at the beginning, that will not block nor execute on the main thread
of our service. And in there, we can do whatever we want. Neat, yes.

And that is where we handle the rest of our fault tolerance.
We'll use 2 other cool Go concepts - tickers and signals,
that will help us to manage when and what happens.

The main maelstrom `Run()` method, that we run at the end of each file, fires up the maelstrom node and allows us to listen on it for different messages. This is a blocking operation. Nothing happens after that point in our system. So if we do something like this
```go
func main() {

  n := maelstrom.NewNode()
  if err := n.Run(); err != nil {
    log.Fatal(err)
  }

  log.Println("hello from after")
}
```
we will see the message `hello from after` only after our service is killed.

Instead, we place the new goroutine at the beginning of the main:
```go
func main() {

  n := maelstrom.NewNode()
  
  go func() {
    log.Println("hello from goroutine")
  }()
  if err := n.Run(); err != nil {
    log.Fatal(err)
  }

}
```
and we also invoke it immediately. This will continue with the execution of everything after it, but also allow us to run stuff on that other thread.

And we get something like this:
```go
  ticker := time.NewTicker(15 * time.Second)
  shutdown := make(chan bool)

  go func() {

    for {
      select {
      case <-shutdown:
        return
      case <-ticker.C:
        copyMap := make(map[string][]float64)
        pending_mu.RLock()
        for k, v := range pending {
          copyMap[k] = make([]float64, len(v))
          copy(copyMap[k], v)
        }
        pending_mu.RUnlock()

        for nh, msgs := range copyMap {
          for _, msg := range msgs {
            if err := n.RPC(nh, BroadcastMessage{
              Type:    "broadcast",
              Message: msg,
            }, func(m maelstrom.Message) error {
              delete_pending(nh, msg)
              return nil
            }); err != nil {
              log.Println("Failed sending message for neighbor", nh)
            }
          }
        }
      }
    }

  }()
```

Explanation time.

```go
  ticker := time.NewTicker(15 * time.Second)
```

This is the ticker.
It sends out signals at an interval.
We listen for these signals in our
`for loop` and attempt to send
all pending messages once again.

```go  
  shutdown := make(chan bool)
```
The shutdown channel is used to send
a signal for a graceful shutdown
of everything.
Because we can't just kill and pray.
That is not how good programmers do it!

In the ticker case, well, you already know.
Check all messages that were not sent for each
neighbour, send them and wait.
If they are received, remove them.
If not - try again later.

One important part.

```go
        copyMap := make(map[string][]float64)
        pending_mu.RLock()
        for k, v := range pending {
          copyMap[k] = make([]float64, len(v))
          copy(copyMap[k], v)
        }
        pending_mu.RUnlock()
```
This creates the new map,
iterates over it and copies the messages locally.
Why? Because of how memory is managed.

Maps and slices are passed by reference, not by value.
So if we directly iterate over the original `pending` map,
we can end up in a situation where we are reading from it
and also writing to it, because we are sending a message.
This will cause race conditions, duplication of messages
and so on.

We don't want that.

That is not how good programmers do it!

# Testing and problems
And now, once all of that is done, let us see how it goes.

Hmmm, I get lost counts and stale messages:

```bash
            :lost-count 14,
            :stale-count 13,
```

Digging a bit with my good friend Claude, it told me to look at the latencies and think about how that could affect my program.

Aha, ticker duration is too long.

See, my stable latencies reported this:
```bash
            :stable-latencies {0 0,
                               0.5 4234,
                               0.95 14036,
                               0.99 14888,
                               1 14888},
```
So, while half the messages took around 4 seconds to be delivered, some took upwards of 15 seconds.

Not good.

I changed the ticker to 5 seconds but it seems like nothing changed.

So I changed it to 1. Huh, times have halved
```bash
            :stable-latencies {0 0,
                               0.5 0,
                               0.95 7861,
                               0.99 8552,
                               1 8577},
```
Hmmm.

After a bit of back and forth, I understood it better.

Each message starts the latency counter. If a node misses it,
it will take (ticker * required_hops) to get the message.
So a longer ticker makes for a higher p99 latency.
It does make sense when you have it spelled out, but yeah.

Okay, so. New test

Aaand it's good.
```Everything looks good! ヽ('ー`)ノ```

Nice. I'm happy.

# Closing out.
All in all, this was a good learning session in my humble opinion.
I feel like I grasped new concepts that are actually useful out
in the real world. I also think I'll think about code a bit more.

I'll clean up the code a bit, make it more Go idiomatic and
move on to the next one.

If you are interested in the code, you can find it [here](https://github.com/stoykotolev/kanwa/blob/main/cmd/broadcast/main.go)

Until next time!
