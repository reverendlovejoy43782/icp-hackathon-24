# A Decentralized and Tamper-Proof Data Layer for the World

*A Bitcoin-Inspired Version of Google Maps as a Public Good*

In an era where our understanding of the world — our surroundings, places across the globe—increasingly comes from digital "second layers" like Google Maps, the information provided by these platforms plays a pivotal role in shaping our decisions in society, security, politics or public health. Just as Bitcoin revolutionized currency by making it a decentralized public good, there's a pressing need for a decentralized and tamper-proof version of this second layer of the world. Such a platform would host critical information about the Earth's surface, serving humanity's best interests.

This project proposes an architecture where the Internet Computer plays a central role. The React app showcased here, developed within the limited time and resource constraints of this hackathon, serves as a preliminary and illustrative implementation of one use case (users interacting with the data layer through smartphones).

# Architecture and how this app fits in

The World's Data Layer, as envisioned in this project, presents a framework for collecting, analyzing, and disseminating geospatial data in a public, decentralized way. This is broadly segmented into three main components:


1. Part: Reading and Writing

This segment represents the real world. 
- Users, through their smartphones or other devices, can retrieve information about specific locations or input data generated by their device sensors into the data layer.
- Agents, such as vehicles experiencing traffic conditions, can send data points during events like accidents.
- Sensors, including weather stations or air quality monitors, also contribute data, for instance, to report flooding or hurricanes.
- APIs / Oracles from organizations like the WHO provide crucial data on pandemic desease outbreaks, health risks or environmental disasters, which are regularly fed into the data layer.

2. Part: Collection, Filtering, and Writing to the Data Layer
   
The Internet Computer plays a central role in this part. It is tasked with receiving data from users, agents, and other sources and writing it to the actual data layer / data storage. Employing filter and consensus mechanisms ensures that only relevant and useful information is stored. Additionally, it defines lifetimes for data points, maintaining the timeliness and relevance of data within the data layer. The Internet Computer can also read information from the data layer and serve as a platform for delivering applications to users.

3. Part: The Data Layer Itself
   
This is the core of the architecture. It comprises the actual data layer, the world surface divided into small squares, akin to concepts like what3words. Each square can be an NFT on the Ethereum blockchain. Only NFTs for Squares are created, where there is data collected in the real world by Part 1 to minimize data and ressource usage. This data object (NFTs on Ethereum) is publicly accessible, enabling widespread analysis and use by anyone. Developers can create their own applications that leverage this data to provide valuable information to users or other participants. It is a publicly accessible data object of the world — a public good. Only the control over collecting, filtering, and writing the data is restricted to the Internet Computer managed and maintained by a large DAO consisting of participants form Part 1 like the WHO, other NGOs, users or even Tesla (as maker of a large group of agents).


## Restrictions of this app compared to the whole concept
The here presented react app is only an example of the use case where users utilize their smartphone to read data about a square and write data. See below a grafic showing the intended architecture of the whole concept and where this app fits in. It lacks the NFT datalayer and the processes on IC to interact with it. The data object is simulated by a data object on the juno datastore. Future versions will utilize the IC capability to interact with Ethereum to create NFTs and append data to them. Lots of data science should be employed to first find the optimal data structure and filtering mechanisms to enhance sustainability and performance of the concept.

Google Slides Link: https://docs.google.com/presentation/d/1CCmkzTppb2zL5DdSr9sPjyvRwRBZbsBAA7WuKWVYa3s/edit?usp=sharing


# React app functionality overview

The React app was developed using the code and platform provided by Juno.

## Underlying repo and platform
- React code used from Juno: https://github.com/junobuild/workshops/tree/main/react
- Juno Platform: https://juno.build
(!) A thank you to David and the Internet Computer (IC) team for this easy to use and convenient platform. It helped being able to do this in the short time frame.

## User flow and app process

User loads the react web app being in a location of interest. User can now 
- click "Show Geo data" to show information about this location or more specifically about the Square (500 x 500 metres) user is in.
- click "Check in" to log user id (hashed) in the data object for this day and square to attest being here. This can be used at e.g. rallies to proof a crowd.

### "Show Geo data"
When selecting "Show Geo Data," App.js activates useGeolocation.js to fetch the user's location, and showGeolocation.js for map visualization on Google Maps. Simultaneously, showTable.js reveals a variety of metrics across several sections, illustrating examples of data that can populate the decentralized data layer:

- Environment: Showcases mock metrics such as Pollution Index, Flooding Probability, and Hurricane Probability, all generated by mockMetrics.js to simulate possible environmental conditions.
- Public Health: Displays simulated data on metrics like the Incidence Rate of Pandemic Diseases, aiming to provide insights into the health landscape of the area.
- Safety and Traffic: Provides a glimpse into safety and traffic scenarios with simulated Crime Rates and Traffic Accident Probabilities.
- Society: This section, enriched by real user interactions, shows the number of users who have checked in at the location today, alongside a comparison to the baseline average of the last 28 days, offering a real-time snapshot of community engagement. For testing purposes the "days" are minutes in the app to simluate better by using the app. There would be more use cases possible like "Alibi indicator" where user would have to authenticate using biometric information like Face ID to log in using the Internet Identitiy and log the hashed user id for a specific square and timestamp. Later one could read this as an indicator that a specific device and a specific person (tied together by biometric auth) where at a certain place at a certain time (this is not implement in the app right now). 

### "Check in"
When users click "Check in," App.js coordinates login via Auth.js (another click on "Login"), when not yet logged in. When logged in it triggers visitors.js module to update the DAU (daily active user, distinct count of hashed user id) count for this geohash, supported by handleWriteFunctions.js. Upon write succes to the datastore it refreshes the table.

## Creating the geohash square

Geolocation Acquisition: Initially, useGeolocation.js fetches the user's geolocation using the browser's navigator.geolocation API, obtaining latitude and longitude.

Grid Area Calculation: areaGenerator.js then calculates a grid area based on these coordinates, defining a broader area for detailed breakdown.

Squares and Geohash Generation: Subsequently, gridGenerator.js divides the grid into smaller squares, assigning a unique geohash to each. This process translates geographic locations into short alphanumeric identifiers, optimizing spatial data representation and storage.

Geohash as Storage Key: The visitors.js module utilizes these geohashes as keys for storing and retrieving location-specific data within a decentralized storage system, ensuring accurate geographical categorization.


