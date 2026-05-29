---
title: Entry [10]
date: 2026-05-29
description: Continuing the Gossip Glomers challenge — implementing single-node and multi-node broadcasting in Go, and fighting race conditions along the way.
tags: [go, distributed-systems, maelstrom, gossip-glomers]
draft: false
---

Welcome welcome, to the house of fun.

In the previous [entry](https://stoykotolev.com/blog/entry-9/) in my ledger, I started going through the [Gossip Glomers](https://fly.io/dist-sys) Distributed Systems challenges.

With the first 2 challenges done, I am now in the big boys league.

# Broadcasting

In today's challenge, we are broadcasting messages between nodes. A gossip system, you can say, heh.

The goal is to create a way to propagate messages to all nodes of the cluster in a kinda flakey way,
without worrying about consistency or duplication of messages.
We just want to make sure that what we say, the nosy neighbour also knows.
If they know too much or too little is not a concern of ours.

The challenge is also split into 2 parts.
In this part, the gossiper will be a single-node one. Yes, it might sound counterintuitive, but it's a start.

# Specs

Okay, so, those are fairly simple. For now.
The system needs to handle 3 types of messages.

- broadcast
- read
- topology

## Broadcast

This is the message that will give us the the gossip. This is where the beans lie. The tea.
All we do here is receive the message, store the value and return that we got it. No need to worry our neighbours that we missed on some spicy secrets.

## Read

Here, we spill what we know. You know, kinda like your best friend in your building. You learn something, they get home from work, they learn it as well. No secrets between us, yeah?

Again, fairly simple. We get a message type `read` and we return this as a response

```json
{
	"type": "read_ok",
	"message": [1, 2, 3, 4, 5]
}
```

## Topology

Thats like the neighbourhoods map. Who's who and what's where.

We'll get this

```json
{
	"type": "topology",
	"topology": {
		"n1": ["n2", "n3"],
		"n2": ["n1"],
		"n3": ["n1"]
	}
}
```

and simply return `topology_ok`

Let's go.

# The code

Now that we've covered what needs to happen, let's get to the happening part.

For the `broadcast` message, it's all fairly simple:

```go
// This here is where we store our values
  values := []int{}

// and here's the handler
  n.Handle("broadcast", func(msg maelstrom.Message) error {

    var body Body
    if err := json.Unmarshal(msg.Body, &body); err != nil {
      return err
    }

    values = append(values, int(body.Message))

    body.Type = "broadcast_ok"

    return n.Reply(msg, body)
  })
```

Next, I think I'm just gonna go with the `topology` message type, as it's even simpler.

```go
  n.Handle("topology", func(msg maelstrom.Message) error {

    var body TopologyMessage

    body.Type = "topology_ok"

    return n.Reply(msg, body)
  })
```

See, simple. For now that is. I am also opting to not store the topology for the moment, as we won't be using that.

And for the `read` message, it's still fairly simple code as well

```go
  n.Handle("read", func(msg maelstrom.Message) error {

    var body Read
    if err := json.Unmarshal(msg.Body, &body); err != nil {
      return err
    }

    body.Messages = values
    body.Type = "read_ok"

    return n.Reply(msg, body)
  })
```

Simple and beautiful. Let's see how I did.

Hm, an error.

Sending the `topology` message expects that the `topology` key isn't present in the `topology_ok` message's payload.

So after looking at what is expected of me, I had to actually do some more work. I had to rework the response body, so that it actually matches the expected rpc payload. Who would've guessed, huh?

Here's how it looks now:

```go
type BroadcastMessage struct {
  Type    string  `json:"type"`
  Message float64 `json:"message"`
}
type BroadcastResponse struct {
  Type string `json:"type"`
}

type TopologyMessage struct {
  Type     string              `json:"type"`
  Topology map[string][]string `json:"topology"`
}

type TopologyResponse struct {
  Type string `json:"type"`
}

type ReadResponse struct {
  Type     string    `json:"type"`
  Messages []float64 `json:"messages"`
}
```

And here are the handlers

```go
  n.Handle("topology", func(msg maelstrom.Message) error {

    var body TopologyMessage
    if err := json.Unmarshal(msg.Body, &body); err != nil {
      return err
    }

    var responseBody = TopologyResponse{Type: "topology_ok"}

    return n.Reply(msg, responseBody)
  })

  values := []float64{}
  n.Handle("broadcast", func(msg maelstrom.Message) error {

    var body BroadcastMessage
    if err := json.Unmarshal(msg.Body, &body); err != nil {
      return err
    }

    values = append(values, body.Message)

    var response = BroadcastResponse{
      Type: "broadcast_ok",
    }

    return n.Reply(msg, response)
  })

  n.Handle("read", func(msg maelstrom.Message) error {

    var body = ReadResponse{
      Type:     "read_ok",
      Messages: values,
    }

    return n.Reply(msg, body)
  })
```

And after a quick rebuild and re-test later

```bash
Everything looks good! ヽ('ー`)ノ
```

Indeed it does little fella. Indeed it does.

# Multi-Node Broadcasts

Now we are getting into the weeds of things.

The next part of this challenge is to go and make our Single-Node gossip machine, into a Multi-Node one. We are no longer just talking to ourselves here. We are talking with the next door neighbour about all the gossip that happens in our building.

So what's changed in the requirements?
We now have to send the data to all of our neighbours, not just as a response.

## First steps

Even in the challenge, they say this:

```text
The simplest approach is to simply send a node's entire data set on every message, however, this is not practical in a real-world system. Instead, try to send data more efficiently as if you were building a real broadcast system.
```

but what did we learn from last time? Keep it simple.

Let's start with the simplest approach. We get a `broadcast` message and we also send the value to all our neighbours. You know, we gossip like we should.

So, a quick and dirty try

```go
// we store our neighbours
    neighbours = body.Topology[n.ID()]
// and we send to them every time we get a `broadcast` message ourselves
    for _, nh := range neighbours {
      if err := n.Send(nh, BroadcastMessage{
        Type:    "broadcast",
        Message: body.Message,
      }); err != nil {
        return err
      }

    }
```

and, expectedly, no dice.

`Analysis invalid! (ﾉಥ益ಥ）ﾉ ┻━┻`

Let's see now. Luckily, the maelstrom team have made it possible to debug in the UI with the `serve` command.

```bash
:valid? false,
:lost-count 89,
```

I guess we lost some gossip, hm. I guess sending on our broadcast isn't what we need to do. What if we directly send all of our available messages as well?

So the send signal becomes this

```go
    for _, nh := range neighbours {
      if err := n.Send(nh, BroadcastNeighbour{
        Type:     "broadcast",
        Messages: values,
      }); err != nil {
        return err
      }

    }
```

and now we get a timeout error. Why?

Looking at the results from Maelstrom, I get why.

```bash
{:index 398, :time 31598712208, :type :ok, :process 2, :f :read, :value [0 0 1 2 3 4 6 7 9 10 12 13 14 17 19 20 24 28 29 32 33 35 36 37 38 39 41 44 45 46 49 50 52 53 55 56 57 58 60 61 62 63 64 65 67 68 69 71 72 73 76 77 78 80 81 82 84 85 86 87 88 90 91 92 93], :final? true}
{:index 399, :time 36602471958, :type :fail, :process 11, :f :read, :value nil, :final? true, :error :net-timeout}
{:index 400, :time 36602572666, :type :fail, :process 5, :f :read, :value nil, :final? true, :error :net-timeout}
{:index 401, :time 36602604500, :type :fail, :process 13, :f :read, :value nil, :final? true, :error :net-timeout}
```

See that very long sequence of numbers?
Those are all the messages that we have received and then send over. And then they get sent over. And you get the gist of it. I told you we'll be against the Two Generals' Problem. It's here.

What can we do about that, though?
Well, if there is a way to check if a node already has the message that is being sent to it, we can skip sending it again.
And also not add it.
This way we can also keep our local values unique
and..... ohhh, Set.
We are gonna use a set.

Unfortunately for us, Go doesn't have sets.
So we are going to implement one ourselves.
Because we are programmers.
That is what we do.
Fortunately for us...
Claude already did it. Nice

```go
var messages = make(map[float64]struct{})

// Add
func add(msg float64) {
  messages[msg] = struct{}{}
}

// Check
func has(msg float64) bool {

  _, ok := messages[msg]
  return ok
}
```

quick, easy, simple. O(1) solution. Nice.

Now, we use that to do some checks, changes here, changes there and here we go

```go
    seen := has(body.Message)

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

aaaaand we timeout again. Ugh

```bash
INFO [2026-05-23 23:57:00,219] jepsen worker 2 - jepsen.util 2  :ok  :read  [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 20 62 69 86 103 104 7 27 31 41 78 80 93 0 15 18 45 46 47 83 53 55 5 21 24 39 44 100 23 26 77 106 107 37 54 61 67 6 12 35 36 57 63 84 96 8 11 51 73 76 81 88 94 13 29 56 59 95 19 22 34 48 50 65 72 101 28 32 97 102 105 1 4 33 49 66 71 82 98 10 17 25 38 70 74 87 91 9 16 43 60 68 85 89 99 14 40 75 79 90 42 52]
```

this doesn't look right. Something in my logic stinks.

It did. It definitely did stink. And not one thing, ehe.

For starters, after implementing the Set, I had to also update the read message types. But in doing so, I didn't set the slice length to 0 initially:

```go
    values := make([]float64, len(messages))
    for k := range messages {
      values = append(values, k)
    }
```

and that is where all the initial 0s came from.

Next, I also didn't account for race-conditions, which happens when you run stuff concurrently. So yeah, that was a bummer.

And lastly, I always sent out the `broadcast_ok` message. Regardless of if the message has already been seen or not. Guess what happens when you send a response to something that doesn't expect a response. Errors, surprisingly.

All in all, small stuff, but they combine over time and made debugging this a bit tiresome.

Here's the final implementation for all messages

```go
package main

import (
  "encoding/json"
  "log"
  "sync"

  maelstrom "github.com/jepsen-io/maelstrom/demo/go"
)

type BroadcastMessage struct {
  Type      string  `json:"type"`
  MessageId *int    `json:"msg_id"`
  Message   float64 `json:"message"`
}

type BroadcastResponse struct {
  Type string `json:"type"`
}

type TopologyMessage struct {
  Type     string              `json:"type"`
  Topology map[string][]string `json:"topology"`
}

type TopologyResponse struct {
  Type string `json:"type"`
}

type ReadResponse struct {
  Type     string    `json:"type"`
  Messages []float64 `json:"messages"`
}

var (
  mu       sync.RWMutex
  messages = make(map[float64]struct{})
)

// Add
func add(msg float64) {
  mu.Lock()
  defer mu.Unlock()
  messages[msg] = struct{}{}
}

// Check
func has(msg float64) bool {
  mu.RLock()
  defer mu.RUnlock()
  _, ok := messages[msg]
  return ok
}

func main() {
  n := maelstrom.NewNode()

  neighbours := []string{}
  n.Handle("topology", func(msg maelstrom.Message) error {

    var body TopologyMessage
    if err := json.Unmarshal(msg.Body, &body); err != nil {
      return err
    }

    neighbours = body.Topology[n.ID()]

    var responseBody = TopologyResponse{Type: "topology_ok"}

    return n.Reply(msg, responseBody)
  })

  n.Handle("broadcast", func(msg maelstrom.Message) error {

    var body BroadcastMessage
    if err := json.Unmarshal(msg.Body, &body); err != nil {
      return err
    }

    seen := has(body.Message)

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

    if body.MessageId != nil {
      return n.Reply(msg, BroadcastResponse{
        Type: "broadcast_ok",
      })
    }

    return nil
  })

  n.Handle("read", func(msg maelstrom.Message) error {
    mu.RLock()
    values := make([]float64, 0, len(messages))
    for k := range messages {
      values = append(values, k)
    }
    mu.RUnlock()

    var body = ReadResponse{
      Type:     "read_ok",
      Messages: values,
    }

    return n.Reply(msg, body)
  })

  if err := n.Run(); err != nil {
    log.Fatal(err)
  }
}
```

and ladies and gentlemen, we got it

```bash
Everything looks good! ヽ('ー`)ノ
```

# What's next?

We finished with both 3a and 3b, which I think is a perfect time to call it a day. For now. This challenges continues on, until we build a fully-fledged broadcasting system and I can't wait. But I want to sleep too.

Looking ahead, we are going to be making this fault tolerant and then optimizing it as much as we possibly can, for the challenge that is. Both of which are fun problems to tackle.

Until next time!
