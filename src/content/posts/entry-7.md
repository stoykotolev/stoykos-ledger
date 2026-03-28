---
title: Entry [7]
date: 2026-03-09
description: Restarting my tech blog and rebuilding my local machine configuration
tags: [dotfiles, macos, fish, shell, devtools, meta]
draft: false
---

Let's not pay much attention to the _small_ gap between this and my last post here.

But what better way to pick up blogging again than with rebuilding almost everything from the ground up and hope it turns into a multi-part series of sorts. We'll see.

In this entry, I wanna go over the configuration for my personal machine. It naturally evolved over the years, without any checkpoints, and it's time to open the timecapsule and see what was what 2 years or so ago.

---

### [The brew file.](https://github.com/stoykotolev/dotfiles/blob/main/Brewfile)

I hadn't touched it in 2 years, looking at the commit, and some things have changed there.
A forgotten, but very important, part of being able to setup my config. It's like the `package.json` to my NodeJS. And just as verbose and messy.

So I gave it the treatment it deserves.

All of the formulae and casks were ordered alphabetically, so it had some order to it. I also cleaned them up a bit. Both [fastfetch](https://github.com/fastfetch-cli/fastfetch) and [neofetch](https://github.com/dylanaraps/neofetch) got added at one point or another and that's just unnecessary, no?

Out with the old (Postman) and in with the new ([Yaak](https://github.com/mountain-loop/yaak)). Postman got tiring with all the requirements and popups and what-nots when starting up, so I wanted an alternative. And a couple of months ago, I found Yaak. An amazing open-source project that covers all my needs. And doesn't suffer from the VC-funded enshittification.

I'm still on [Arc](https://arc.net/), although the Jira acquisition makes me feel some type of way. So I'm looking at [Zen](https://zen-browser.app/) these days. (Yes, I'm on a Mac, no I don't think I should install Arch btw.)

With the `Brewfile` updated, I ran the bundle command to update my lockfile and... huh, I had that commited. Welp, removed the lock file as well.

### Install and Setup scripts

The, what I call, _bread and butter_ of my configuration.

These are the files that execute everything and setup my machine with a simple curl request.

The `install.sh` itself couldn't really change much. Move a couple of variable declarations around, add some empty lines for readability's sake and it's done.

The `setup.sh` file, however, was in some need of attention. A lot of random lines, nothing really explained, not very programmer-like. So I went [COMMENT: Better wording at the end here.]

This:

```bash
    log_start "Installing 'brew' and dependencies from 'Brewfile'"
    if ! eval_brew; then
        NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

        eval_brew

        log_end 'Brew installed'
    else
        log_end 'Brew detected'
    fi
    brew bundle --file $CONFIG/Brewfile
    echo
```

got refactored into its own named function:

```bash
function setup_brew() {
    log_start "Installing 'brew' and dependencies from 'Brewfile'"
    # rest of the function here....
}
```

The dock function got the same treatment. I also changed the dock position, because it was on the right? Why? I don't know, but I am a brute no longer, so I gave it its rightful place at the bottom.

One thing I did add was a function to setup the shell I use.

```bash
function setup_shell() {
    log_start "Setting up fish as default shell"
    if [ -x "/opt/homebrew/bin/fish" ]; then
        FISH="/opt/homebrew/bin/fish"
    elif [ -x "/usr/local/bin/fish" ]; then
        FISH="/usr/local/bin/fish"
    elif command -v fish >/dev/null 2>&1; then
        FISH="$(command -v fish)"
    else
        log_end "Fish not found. Install it first (e.g.,: brew install fish)."
    fi

    # Ensure fish is listed in /etc/shells (required for chsh on macOS)
    if ! grep -qx "$FISH" /etc/shells; then
        echo "Adding $FISH to /etc/shells (requires sudo)..."
        # Use tee so it works with sudo redirection
        printf "%s\n" "$FISH" | sudo tee -a /etc/shells >/dev/null
    fi

    # Change default shell for current user
    chsh -s "$FISH"

    log_end "Fish setup as default shell"
    echo
}
```

### Fish

I like it, no I don't judge if you don't.

I just kind of got tired of needing a lot of things for my shell to work. Yeah, I could've done my own autocomplete or used a zsh plugin, but... why? And that's when I found fish. It has autocomplete, syntax highlighting and offers good scripting for the few times I need it.

So off I went through my current fish config, looking at what I need and what I don't. (At this point, I got sidetracked with Neovim native keybinds and where to use them, but that's coming in the future. I hope.)

This is the point at which I also relied on AI as my companion. My comrade in arms. The mercenary of choice was ChatGPT-4o and the “Fish Shell Sage” GPT. And off we went, on a great adventure.

My `PATH` setup was bad and it made sure I feel bad about it. So now I do

```bash
fish_add_path ~/.cargo/bin /opt/homebrew/bin
```

instead of

```bash
set PATH $PATH ~/.cargo/bin
fish_add_path /opt/homebrew/bin
```

like a true fish virtuoso

It also suggested splitting my config in different files and such, but after giving it some thought, I went against that. I hate having to jump through files and folders to find what I need. And it shouldn't be _that long_ of a file, hm? A couple of comments and I'm set.

Then, I saw this:

```bash
function typeorm
  npm run typeorm:$argv[1]
end
```

Dark times... but at least they are long gone now, like the function that represented them.

There were also a bunch of git aliases. 20 lines of them. And while going through each one, I couldn't remember when I last used any. [Lazygit](https://github.com/jesseduffield/lazygit) is amazing and I live in it, whenever I need something done with git. That is how the fish config file ended up with 20 lines less.

[fnm](https://github.com/Schniz/fnm), which is a multi Node.js env manager, commands filled out the tail end of my config. And looking at the Readme, it didn't look like I need them? Aaaaaand they're gone.

Bun was another tool living in my fish config, but not my workflow. I guess it didn't rise enough. (sorry, not sorry)

And a postgre docker script? Yeah, the file **is** old.

### Some more gardening.

The `dotfiles` folder had more leftovers yet, that got weeded out.
An `iterm2` folder and I hadn't used that in _a while_. A neofetch `neofetch` folder from the good ole days and the likes.

That’s about it for this entry. I’m happy with the cleanup—trimming old configs, removing unused tools, and bringing a bit more structure to my dotfiles. The repo feels leaner and more intentional now.

Next up: my Neovim configuration. As tradition demands, at least one full rework per year. I might also revisit my Tmux setup while I’m at it.
