# A Decentralized and Tamper-Proof Data Layer for the World

*A Bitcoin-Inspired Version of Google Maps as a Public Good*

In an era where our understanding of the world — our surroundings, places across the globe—increasingly comes from digital "second layers" like Google Maps, the information provided by these platforms plays a pivotal role in shaping our decisions in society, security, politics or public health. Just as Bitcoin revolutionized currency by making it a decentralized public good, there's a pressing need for a decentralized and tamper-proof version of this second layer of the world. Such a platform would host critical information about the Earth's surface, serving humanity's best interests.

This project proposes an architecture where the Internet Computer plays a central role. The React app showcased here, developed within the limited time and resource constraints of this hackathon, serves as a preliminary and illustrative implementation of one use case (users interacting with the data layer through smartphones).

# Architecture and how react app fits in

The World's Data Layer, as envisioned in this project, presents a framework for collecting, analyzing, and disseminating geospatial data. This is broadly segmented into three main components:

1. Part: Reading and Writing

This segment facilitates direct interaction between the world and the data layer. 
- Users, through their smartphones or other devices, can retrieve information about specific locations or input data generated by their device sensors into the data layer.
- Agents, such as vehicles experiencing traffic conditions, can send data points during events like accidents.
- Sensors, including weather stations or air quality monitors, also contribute data, for instance, to report flooding or hurricanes.
- APIs / Oracles from organizations like the WHO provide crucial data on pandemic desease outbreaks, health risks or environmental disasters, which are regularly fed into the data layer via interfaces.

2. Part: Collection, Filtering, and Writing to the Data Layer
The Internet Computer plays a central role in this part. It is tasked with receiving data from users, agents, and other sources. Employing filter and consensus mechanisms ensures that only relevant and useful information is stored. Additionally, it defines lifetimes for data points, maintaining the timeliness and relevance of data within the data layer. The Internet Computer also reads information from the data layer, processes it, and manages the deletion of data points when their lifetime expires. It serves as a platform for delivering applications to users as well.

Part 3: The Data Layer Itself
At its core, the system comprises the data layer, the world divided into small squares, akin to concepts like what3words. Each square can be an NFT on the Ethereum blockchain. Only NFTs for Squares are created, where there is data collected in the real world by Part 1 to minimize data and ressource usage. This data object (NFTs on Ethereum) is publicly accessible, enabling widespread analysis and use by anyone. Developers can create their own applications that leverage this data to provide valuable information to users or other participants. It is a publicly accessible data object of the world—a public good. Only the control over collecting, filtering, and writing the data is restricted to the Internet Computer maybe controlled by a large DAO consisting of participants form Part 1 like the WHO, other NGOs, users or even Tesla (as maker of a large group of agents).


# React app functionality overview

The React app was developed using the code and platform provided by Juno.

## Underlying repo and platform
- React code used from Juno: https://github.com/junobuild/workshops/tree/main/react
- Juno Platform: https://juno.build
(!) A thank you to David and the Internet Computer (IC) team for this easy to use and convenient platform.

## Inner workings

Upon selecting "Show Geo Data," App.js activates useGeolocation.js to fetch the user's location, and showGeolocation.js for map visualization on Google Maps. Simultaneously, showTable.js reveals a variety of metrics across several sections, illustrating examples of data that can populate the decentralized data layer:

Environment: Showcases mock metrics such as Pollution Index, Flooding Probability, and Hurricane Probability, all generated by mockMetrics.js to simulate possible environmental conditions.
Public Health: Displays simulated data on metrics like the Incidence Rate of Pandemic Diseases, aiming to provide insights into the health landscape of the area.
Safety and Traffic: Provides a glimpse into safety and traffic scenarios with simulated Crime Rates and Traffic Accident Probabilities.
Society: This section, enriched by real user interactions, shows the number of users who have checked in at the location today, alongside a comparison to the baseline average of the last 28 days, offering a real-time snapshot of community engagement.
When users "check in," App.js coordinates a secure data capture and analysis process. Authentication through Auth.js and user privacy via CryptoJS hashing are paramount. The visitors.js module updates the DAU count for the geohash, supported by handleWriteFunctions.js for data operations on the decentralized layer. This not only allows users to see how many others have shared their presence but also contextualizes this activity against historical averages, analyzed and displayed by visitors.js.




## Getting started

Make sure you have [node.js](https://nodejs.org) LTS installed.

```bash
git clone https://github.com/junobuild/examples
cd react/diary
npm ci
```

## Local development

```
npm run start
```
