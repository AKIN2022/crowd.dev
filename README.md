<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://github.com/CrowdDotDev/crowd.dev">
    <img src="https://user-images.githubusercontent.com/41432658/198395147-20caad79-6989-4827-bb0b-32a406770480.png" alt="Header Logo">

  </a>

  <h2 align="center">The community-led growth platform, built with developers in mind.</h2>
  
  <p align="center">
    <br>
    <a href="https://crowd.dev/sign-up">Cloud Version (Beta)</a>
    |
    <a href="https://docs.crowd.dev">Docs</a>
    |
    <a href="https://crowd.dev/discord">Discord</a>
    |
    <a href="https://crowd.dev/twitter">Twitter</a>
    |
    <a href="https://crowd.dev/newsletter-sign-up">Newsletter</a>
    |
    <a href="https://crowd.dev/roadmap">Roadmap</a>
  </p>
</p>

<!-- BODY -->

## About crowd.dev

crowd.dev is an open-source suite of community and data tools built to unlock community-led growth for your organization.

In recent years, community has moved to the forefront of business. But building community is hard. In the beginning, organizations have to continuously find community members and maintain a high engagement among them. Once a community is thriving, organizations are stuck managing endless tools, working with incomplete data, and failing to bring the return of community back to their business.

crowd.dev is here to change this. Self-hosted or hosted by us, with developers in mind, open to extensions, and with full control over your community's data.

<img src="https://user-images.githubusercontent.com/41432658/198830271-cbe6d3c7-0c46-4539-98cc-b13c495ddedf.png" alt="UI Home screen">


## ✨ Features
### Core Features
- Integrate with platforms like GitHub, Discord, Slack, Twitter or DEV to track community activities
- Get background information about your community members & the companies they belong to and manage them with tags and automated segmentation
- Analyze your community, create custom metrics, organize them in reports and share them publicly with your community, your investors, or your team
- Use webhooks to automate routine tasks

### Growth Apps
- [Community Help Center](https://www.crowd.dev/community-help-center): Detect relevant conversations and publish them in a community help center to reduce duplicate questions and get your community's content listed on search engines
- [Eagle Eye](https://www.crowd.dev/eagle-eye): Monitor dev-focussed community platforms to find relevant content to engage with, helping you to gain developers’ mindshare and grow your community organically

## 🔔 Stay up-to-date

Crowd.dev is still in beta and we ship new features every month. To stay in the loop, leave us a star and subscribe to our <a href="https://crowd.dev/newsletter-sign-up">monthly newsletter</a>. Thanks a lot! ❤️

## 🚀 Getting started

### Cloud version

Our <a href="https://crowd.dev/#waitlist">cloud version</a> is a fast, easy and free way to get started with crowd.dev. We're currently still in closed beta but onboard new communities every week.

### Self-hosted version

Our self-hosted version can be run and deployed by default following our free AGPL license. All premium components will be hidden and inactive with the default configuration. You can run, deploy, and contribute to the app without fearing to violate the premium license. Check out the [premium self-hosted features docs](https://docs.crowd.dev/docs/premium-self-hosted-apps) to know more about the premium self-hosted features.

#### Deployment with Kubernetes

Our services can be deployed using Kubernetes, as well as a lightweight development environment using Docker. You can read more about it in our [self-hosting docs](https://docs.crowd.dev/docs/deployment).

#### Integrations

We currently support four integrations for self-hosting: GitHub, Twitter, Discord and Slack. For each one of them you will need to create your own application. You can see the steps for each integration in our [self-hosting integrations guide](https://docs.crowd.dev/docs/self-hosting).

### Development environment

#### <a name="requirements">Requirements</a>

- Node v16.16.0
- Docker and docker-compose

#### <a name="getting_started">Getting started</a>

1. Get the mono repo from GitHub

```shell
git clone git@github.com:CrowdDotDev/crowd.dev.git
```

2. Run the start script

```shell
cd scripts
./cli start
```

App will be available at http://localhost:8081

For more information on development, you can <a href="https://docs.crowd.dev/docs/docker-compose-single-machine-development-with-docker-images">check our docs</a>.

## 🗺️ Roadmap

Our goal is to build the most powerful platform for building developer communities out there. In the upcoming months we'll focus on the following features:

- [ ] More integrations (LinkedIn, Reddit, Stack Overflow, etc.)
- [ ] Standadlone organization module to find out more about the companies behind your members
- [ ] Tasks module to receive recommendations for actions and collaborate with colleagues
- [ ] Open marketplace for community building apps

You can find more features on our [public roadmap](https://crowd.dev/roadmap). Feel free to also [open an issue](https://crowd.dev/open-an-issue) for anything you're missing.

## ✍️ Contribution

There are many ways you can contribute to crowd.dev! Here are a few options:

- Star this repo and follow us on <a href="https://crowd.dev/twitter">Twitter</a>.
- Create issues every time you feel something is missing or goes wrong.
- Upvote issues with 👍 reaction so we know what's the demand for particular issue to prioritize it within roadmap.

If you would like to contribute to the development of the project **please reach out first** (e.g. via Discord). 

All contributions are highly appreciated. 🙏

## ⚖️ License

Distributed under the AGPLv3 License. See `LICENSE` for more information.

## 💌 Acknowledgements

Crowd.dev is powered by these awesome projects:

- <a href="https://github.com/vuejs/vue">Vue.js</a>
- <a href="https://github.com/tailwindlabs/tailwindcss">Tailwind CSS</a>
- <a href="https://github.com/cube-js/cube.js">Cube.js</a>
- <a href="https://github.com/superfaceai/one-sdk-js">Superface</a>
- <a href="https://github.com/meilisearch/meilisearch">Meilisearch</a>
