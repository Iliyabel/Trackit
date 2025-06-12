<div align="center">

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000)
  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=fff)
  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=fff)
  ![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

</div>

<br />
<br />

<br />
<div align="center">
  <a href="https://github.com/i">
    <img src="readmeAssets/LogoText.svg" alt="Logo" width="auto" height="100">
  </a>

<h3 align="center">Trackit<br>Application Tracker</h3>

  <p align="center">
    Trackit is an application tracking system which allows users to better manage their job hunting process, gain insights into their progress, and stay on top of opportunities.
    <br />
    <a href="https://trackit-1-ha2j.onrender.com"><strong>Visit Site»</strong></a>
    &middot;
    <a href="https://github.com/Iliyabel/Trackit"><strong>Explore the docs »</strong></a>
    <br />
    <br />
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#ℹ️-about-the-project">ℹ️ About The Project</a>
    <li><a href="#📌-getting-started">📌 Getting Started</a></li>
            <ul>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#usage">Usage</a></li>
      </ul>
    </li>
    <li>
      <a href="🛠️-built-with">🛠️ Built with</a>
    </li>
    <li><a href="🛣️-roadmap">🛣️ Roadmap</a></li>
    <li><a href="#👥-contributors">👥 Contributors</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## ℹ️ About The Project

<img src="readmeAssets/dashboard.png" alt="Logo" >

Trackit allows users to login then add, edit and delete job applications. It gives an easy-to-use UI, delivering key insights on your job hunt and full control on sortting, filter and querying for job applications. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- HOW TO USE -->
## 📌 Getting Started

You can visit our deployed site <a href="https://trackit-1-ha2j.onrender.com">here</a>. See below on deploying the code locally.  

### Prerequisites

* AWS API gateway URL
  ```
  VITE_DB_API_URL=https://exampleARN.execute-api.us-west-2.amazonaws.com/stage
  ```

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/Iliyabel/Trackit.git
   ```
2. Navigate to the client folder and install front-end dependencies. The backend is hosted by AWS and auth by Firebase.
   ```sh
   cd Trackit
   cd client
   npm install
   ```
3. Set your environment variables in `.env` file. See `.env.template` for variables.
   ```
   VITE_DB_API_URL=[API URL]
   ```

### Usage
Run the front end using Vite.
```
npm run dev
```

❗ NOTE: You can either create a new account or use our preconfigured example account. 

Example account login:
* Email: 
`ethan@example.com`
* Password: `Password!`

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- BUILT WITH -->
## 🛠️ Built With

### 💻 Frontend:<br>
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=fff)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=fff)

### 🗄️Backend: <br>

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Firebase Auth](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=000)
![API Gateway](https://img.shields.io/badge/AWS_API_Gateway-FF4F8B?style=for-the-badge&logo=amazonaws&logoColor=white)
![Lambda](https://img.shields.io/badge/AWS_Lambda-F79E1B?style=for-the-badge&logo=aws-lambda&logoColor=white)
![DynamoDB](https://img.shields.io/badge/DynamoDB-4053D6?style=for-the-badge&logo=amazon-dynamodb&logoColor=white)

### Architecture
![Architecture Diagram](readmeAssets/architecture.png)

Our projects backend uses serverless functions (Lambda) and AWS's API Gateway as a reverse proxy. The serverless functions are written in Java with the exception of the authorization Lambda which is written in javascript (to utilize the Firebase SDK). Authentication is done by Firebase Auth and public endpoints are protected by requiring an Authorizatino token from Firebase. The database is a NoSql AWS DynamoDB database. 

### React Dependencies
![React Dependency Diagram](readmeAssets/reactDependencies.png)

Our front end is rendered using React. We use the react router for navigation. Our website is composed of primarily 4 pages, and it uses a set of smaller components and utility classes. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- RoadMap -->
## 🛣️ Road Map
From our original proposal:

### P1 - Top Priority
- [x] Setup secure authentication system
- [x] Setup ~~SQL~~ NoSQL database and Rest API for CRUD commands
- [x] Create a front end that allows users to create and interact with job applications
  - [x] Add dynamic filter
  - [x] Ensure responsive UI (excluding mobile)
- [x] Deploy application using a cloud service
  - [x] Deploy front end using a CDN
  - [x] Deploy back end using serverless cloud functions

### P2 - Secondary
- [ ] Implement reminder feature allowing user to add To-dos
- [ ] Create an API to automatically parse a job posting and retrieve the application data

<!-- Contributions -->
## 👥 Contributors
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/JLavigueure">
        <img src="https://avatars.githubusercontent.com/JLavigueure" width="80px" style="border-radius: 50%; border: 3px solid black;" alt="JLavigueure"/><br />
        <sub><b>JLavigueure</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Iliyabel">
        <img src="https://avatars.githubusercontent.com/Iliyabel" width="80px" style="border-radius: 50%; border: 3px solid black;" alt="Iliyabel"/><br />
        <sub><b>Iliyabel</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/acheema5">
        <img src="https://avatars.githubusercontent.com/acheema5" width="80px" style="border-radius: 50%; border: 3px solid black;" alt="acheema5"/><br />
        <sub><b>acheema5</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/srames50">
        <img src="https://avatars.githubusercontent.com/srames50" width="80px" style="border-radius: 50%; border: 3px solid black;" alt="srames50"/><br />
        <sub><b>srames50</b></sub>
      </a>
    </td>
  </tr>
</table>
