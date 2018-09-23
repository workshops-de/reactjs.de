# ReactJS.DE
Website for the german React Community [ReactJS.de](https://reactjs.de/).

## Build Status
![Build Status](https://travis-ci.org/symetics/reactjs.de.svg?branch=master "Travis Build Status")

## Development

### 0. Prerequisite Software

* [Git](http://git-scm.com) and/or the **GitHub app** (for [Mac](http://mac.github.com) or
  [Windows](http://windows.github.com)); [GitHub's Guide to Installing
  Git](https://help.github.com/articles/set-up-git) is a good source of information.

* [Ruby](https://www.ruby-lang.org/en/)

### 1. Getting the Sources

Fork and clone repository:

1. Login to your GitHub account or create one by following the instructions given
   [here](https://github.com/signup/free).
2. [Fork](http://help.github.com/forking) the [main repository](https://github.com/symetics/reactjs.de).
3. Clone your fork of the repository and define an `upstream` remote pointing back to
   the main repository that you forked in the first place.

```shell
# Clone your GitHub repository:
git clone git@github.com:<github username>/reactjs.de.git

# Go to the directory:
cd reactjs.de

# Add the main repository as an upstream remote to your repository:
git remote add upstream https://github.com/symetics/reactjs.de.git
```

### 2. Install the project dependencies
```bash
# install bundler as ruby package manager
gem install bundler
# install the project depdencies defined int the Gemfile
bundle install
```

### 3. Run the jekyll instance

```bash
# start the web page at http://localhost:4000
bundle exec jekyll serve --incremental
```

### 4. Pull Request
Createa a [Pull Request](https://help.github.com/articles/creating-a-pull-request/) to describe and propose your changes to this repository.
If you don't know what Pull Requests(PR) all about you should check out [this article](https://help.github.com/articles/about-pull-requests/).



