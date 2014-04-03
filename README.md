# mkhere

Command line utility used to create files based on pre-defined templates

[![NPM](https://nodei.co/npm/mkhere.png)](https://nodei.co/npm/mkhere/)

### Usage

`mkhere list` - List all templates in _USER_HOME_DIR/.templates/_

`mkhere help` - Show usage/help

`mkhere tplname.html newname` - Create new file _newname.html_ based on _USER_HOME_DIR/Templates/tplname.html_ in current  working directory

### Auto-completion

Run: `mkhere --completion >> ~/.mkhere.completion.sh && echo 'source ~/.mkhere.completion.sh' >> .bashrc` In order to enable auto-completion in your __bash__ terminal, or `echo '. <(./githubber --completion)' >> .zshrc` if you're using __zsh__