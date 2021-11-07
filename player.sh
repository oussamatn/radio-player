#!/usr/bin/env bash

# This is a general-purpose function to ask Yes/No questions in Bash, either
# with or without a default answer. It keeps repeating the question until it
# gets a valid answer.
ask() {
  # https://djm.me/ask
  local prompt default reply

  while true; do

    if [[ "${2:-}" == "Y" ]]; then
      prompt="Y/n"
      default=Y
    elif [[ "${2:-}" == "N" ]]; then
      prompt="y/N"
      default=N
    else
      prompt="y/n"
      default=
    fi

    # Ask the question (not using "read -p" as it uses stderr not stdout)
    echo -n "$1 [$prompt] "

    read reply

    # Default?
    if [[ -z "$reply" ]]; then
      reply=${default}
    fi

    # Check if the reply is valid
    case "$reply" in
    Y* | y*) return 0 ;;
    N* | n*) return 1 ;;
    esac

  done
}



install() {
  echo "Installing the player ..."
  if ask "Clone player repository ?" Y; then
    echo "Cloning repo..."
    #git clone https://github.com/oussamatn/radio-player.git ../radio-player
  fi
  if [[ ! -f docker-compose.override.yml ]]; then
    if ask "Your version of Docker Compose is out of date. Attempt to update it automatically?" Y; then
          cp ./radio-player/docker-compose.override.yml .
    fi
  fi
}

install