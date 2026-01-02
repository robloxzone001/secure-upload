app.get("/view/:token", async (req, res) => {
  const media = await Media.findOne({ token: req.params.token });

  if (!media || media.viewed) {
    return res.sendFile(__dirname + "/public/expired.html");
  }

  // Mark as viewed immediately
  await Media.updateOne({ token: media.token }, { viewed: true });

  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Secure View</title>
<style>
  body {
    margin:0;
    background:black;
    color:white;
    font-family:Arial;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    height:100vh;
    text-align:center;
  }
  img {
    max-width:90%;
    border-radius:10px;
    transition: opacity 1s;
  }
  #countdown {
    margin-top: 15px;
    font-size: 20px;
    color: #ff4d4d;
  }
</style>
</head>
<body>

<h3>Media will disappear in <span id="count">5</span> sec</h3>
<img id="media" src="${media.mediaUrl}" />

<div id="countdown"></div>

<script>
  let time = 5;
  const countEl = document.getElementById("count");
  const img = document.getElementById("media");

  const interval = setInterval(() => {
    time--;
    countEl.innerText = time;

    if(time <= 0){
      clearInterval(interval);
      img.style.opacity = 0; // fade-out effect
      setTimeout(() => {
        document.body.innerHTML = \`
          <div style="color:red; font-family:Arial; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh;">
            <h2>❌ Secure Link Expired</h2>
            <p>This media was designed to be viewed only once.</p>
          </div>
        \`;
      }, 1000); // wait 1 sec for fade-out
    }
  }, 1000);
</script>

</body>
</html>
  `);
});
