# bitlab-voteview [![Circle CI](https://circleci.com/gh/littlebits/bitlab-voteview.svg?style=svg)](https://circleci.com/gh/littlebits/bitlab-voteview)

Create and manage links between bitLab votes and cloudBits

## Deploying Prerequisites

- You have a [Kubernetes](http://kubernetes.io) cluster on [GKE](https://cloud.google.com/container-engine/)
- You have [`envsubst`](http://stackoverflow.com/questions/23620827/envsubst-command-not-found-on-mac-os-x-10-8) installed
- You have `gcloud` using default `--zone` `--cluster` and `--project`
- If you are forking, your own Quay.io auto-build setup and have updated `deploy/pod.yaml` to point to it instead of littleBits

## Deploying

This project has some minor tooling to support deployment to a Kubernetes cluster. It is currently bias to GKE and hence uses the `gcloud` CLI tool, but this is not be a hard requirement; You are obviously free to use `kubectl` directly instead of the tasks within `Makefile`.

An easy way to create a Kubernetes cluster is with [GKE](https://cloud.google.com/container-engine/). The tasks in `Makefile` work for this case via `$ gcloud preview container`.

The folder `deploy` contains a `pod.yaml` which tells Kubernetes how to run this project. It pulls from this project's image from [quay.io](http://quay.io/) which in turn we have setup (on our account there) to build a new image of this project on every push to `master` (at Github). So a full flow currently looks like this:

1. Make source code updates, push to Github `master` at will
2. Once you want to deploy, first wait for Quay to finish building the latest pushes to `master` branch on Github.
3. Then, if this is your first deploy, execute `make deploy-create BITLAB_VOTEVIEW_ACCESS_TOKEN=...` where `...` is filled out with an `access_token`. You can acquire this from [Cloud Control](http://control.littlebitscloud.cc/) (Go to `settings` tab, then scroll down).
4. If this is *not* your first deploy, but rather an update then execute `make deploy-update BITLAB_VOTEVIEW_ACCESS_TOKEN=...` following the same instructions as above for the `...` part.

As Kubernetes, OpenShift, et al tools mature we expect these instructions to radically simplify.



## ENV Guide

The following ENV vars are supported.

Required:
- `BITLAB_VOTEVIEW_ACCESS_TOKEN`

Optional:
- `BITLAB_VOTEVIEW_AUTH_USER`
- `BITLAB_VOTEVIEW_AUTH_PASS`
- `BITLAB_VOTEVIEW_HOST`
