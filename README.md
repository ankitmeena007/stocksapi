# Stocksapi
This is a basic application displaying live stocks using alphavantage api with Socket io

# Getting Started
# installing
install the required dependencies after initializing npm.
For example,
<pre><code>npm i express</code></pre>

# API
The api used here is provided by alphavantage which allows upto 5 free requests per minute 500 per day

<p>In case of read property error (property of undefined object) wait for couple of minutes and try again.
This is usually when fetch limit per minute is exceeded </p>

<br>
<p>The Stocks Data gets updated every 5 seconds subjected to the free api limit</p>

# Hosting
<p>Host locally at localhost:8000 or through a PaaS after deploying online</p>
 <p> use nodemon or node to start server by running app.js</p>
