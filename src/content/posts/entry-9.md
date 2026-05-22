---
title: Entry [9]
date: 2026-05-23
description: Starting the Fly.io Distributed Systems challenges in Go — first two down, Gossip Glomers off to a great start.
tags: [go, distributed-systems, maelstrom, gossip-glomers]
draft: false
---

久しぶりだな!

As you can see, I've been back on the language learning grind in my free time.
And between that and my personal addiction - gaming,
I haven't had much free time for much else.

But getting bored and kinda sick of Web Dev and the same ol' same ol', a bit
more free time at work and the fact that some people write code worse than me,
which brought the state of my favourite game to the absolute gutter,
made me pull my head out of my a... the sand and look around.
And boy, what did I get recommended again.

I present to you, [Gossip Glomers](https://fly.io/dist-sys/).
Or known by its other name - Fly.io Distributed Systems Challenge.
A set of 6 different distributed systems related challenges, each presenting
a different style of problem that is solved using Distributed System.

Distributed systems have always been a topic that interests me,
but I never gave myself enough time to properly learn and understand them.
But no more! Back in the day, I tried doing them in Rust, when I was learning it,
by following in the footsteps of Jon Gjengset and
his amazing [stream](https://www.youtube.com/watch?v=gboGyccRVXI) on the topic.
Unfortunately for me, I knew close to nothing and I was not armed
with the patience of an older, wiser person. Not that I am now,
but I am just more inclined to take my time when learning something now.
That one I got by studying Japanese.

## The plan

The plan is simple:

- Start the challenges one by one
- For the unknown concepts, take my time to learn and study more on them.
- Unless I 100% clear the challenge requirements, I will not proceed.
- Have no end date. If it takes me a year, so be it.

For the purposes of the challenge, I'll be going with Go.
I wanna practice it more and what better way than writing something,
without knowing what it exactly is. I also took the liberty of taking
a sneak peek at the challenges and I see some optimization requirements in there.

## The setup

The first step is getting everything needed for the challenge.

[Maelstrom](https://github.com/jepsen-io/maelstrom),
a workbench used to test distributed systems and the Go repo boilerplate.

Because I'm a silly zoomer that grew up with dopamine injected
straight into my veins, I can't remember commands and repeat them.
So my next most important setup was creating a Makefile to help me not have
to repeat the same commands over and over and over and over again.
And as I am a silly zoomer that grew up with dopamine injected
straight into my veins, Makefile teachings were before my time.
So I asked my good friend Claude Code to set one up for me
and it did a pretty good job.

```makefile
MAELSTROM := ../maelstrom/maelstrom
CHALLENGES := $(patsubst cmd/%/,%,$(wildcard cmd/*/))

.PHONY: build clean $(CHALLENGES:%=test/%)

build: $(CHALLENGES:%=bin/%)

bin/%:
	go build -o $@ ./cmd/$*

test/echo: bin/echo
	$(MAELSTROM) test -w echo --bin bin/echo --node-count 1 --time-limit 10

clean:
	rm -f $(CHALLENGES:%=bin/%)
```

This way, I don't have to always run the

```go
go build -o bin/echo ./cmd/echo.go
```

I can just do

```bash
make bin/echo
```

and everything is set up.

It also has a command for the tests, that will help me directly run them
without needing having to always have the full command available.

Handy, yeah? We have it good in our time.

## The challenges

### Echo

Echo is the first challenge in the series and it's more an introduction than a challenge.

It helps you get started with showing you how to use the Go lib, which handles
communication inside of Maelstrom's mesh of nodes.
And compared to how it had to be implemented in Rust, this is pretty simple:

```go
package main

import (
  "encoding/json"
  "log"

  maelstrom "github.com/jepsen-io/maelstrom/demo/go"
)

func main() {
  n := maelstrom.NewNode()

  n.Handle("echo", func(msg maelstrom.Message) error {
    // Unmarshal the message body as an loosely-typed map.
    var body map[string]any
    if err := json.Unmarshal(msg.Body, &body); err != nil {
      return err
    }

    // Update the message type to return back.
    body["type"] = "echo_ok"

    // Echo the original message back with the updated message type.
    return n.Reply(msg, body)
  })

  if err := n.Run(); err != nil {
    log.Fatal(err)
  }
}
```

The goal of this challenge is the following:

- get a message of type `echo`
- Swap the dest and src keys of the payload
- Set the type to `echo_ok`
- Respond

See, simple, easy, fast.

```bash
Everything looks good! ヽ('ー`)ノ
```

It does my guy, it sure does.

### Unique Ids

Now we are getting into actually having to write some code ourselves.

The goal of this challenge is simple:

- receive a `generate` message
- return a `generate_ok` message with a unique id.

The test runs on a 3-node cluster. Which means that we need to ensure that id uniqueness can be preserved across all nodes.

Now, I just brute forced it at the beginning. And that didn't work of course. Setting the id to 1 for all nodes and incrementing by 1 isn't a great strategy. But it was a start.

Then I had the idea of using the msg_id, along with the id. But there were still collisions here. So yeah...

Next, I tried incrementing the id with a random number. Now, the collisions were less, but they still were there.

Hm.

Back to my good friend Claude I went. And it gave me a solution so simple, yet so perfect, I'm mad I didn't figure it out myself. You shouldn't write code while tired kids.

The `id` param can be anything. A number, a boolean, an array even. Or a **string**.

Yeah, each node has its own id. And how do you enforce uniqueness. Assign it to the node id. Mh.

So here's how the unique id looks:

```go
		body["id"] = fmt.Sprintf("%s-%d", n.ID(), id)
		id += 1
```

And we got it.

```bash
Everything looks good! ヽ('ー`)ノ
```

A good reminder of the KISS principle. I'll have to keep it in mind for the next challenges.

## Summary

Well, this is getting quite long of a post. And as you can see, I'm a bit more tired than allowed for these types of challenges.

And I also happen to know what the next challenge entails and I will for sure need a bit more brain power for it. _Hint_: It needs keeping state and knowing who's who and what's where. And a bit of the [Two Generals' Problem](https://en.wikipedia.org/wiki/Two_Generals%27_Problem).

But all that is for next time.

また次回お会いしましょう!
