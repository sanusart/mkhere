# mkhere

Command line utility used to create files based on pre-defined templates

[![NPM](https://nodei.co/npm/mkhere.png)](https://nodei.co/npm/mkhere/)


## installation

Install using NPM `$ (sudo) npm install --global mkhere`

## Usage

#### Initiate `~/.templates` directory within your home folder containing sample templates

> Run: `mkhere init`

#### List all templates in ~/.templates

> Run: `mkhere list`

#### Create new file in current directory

> Run: `mkhere tplname.html newname`

Will create _newname.html_ based on _~/.templates/tplname.html_ in current directory

#### Create new file in different directory

> Run: `mkhere html.html ~/Desktop/sa`

Will create _sa.html_ based on _~/.templates/html.html_ on Desktop

#### Create new DOT file in current directory

> Run: `mkhere editorconfig.editorconfig ""`

Will create _.editorconfig_ dot file based on _~/.editorconfig.editorconfig_ in current directory

... and so on ...

## Auto-completion

#### In order to enable auto-completion in your `BASH` shell

Run: `mkhere --completion >> ~/.mkhere.completion.sh && echo 'source ~/.mkhere.completion.sh' >> ~/.bashrc`

#### In order to enable auto-completion in your `ZSH` shell

Run: `echo '. <(./mkhere --completion)' >> .zshrc`
