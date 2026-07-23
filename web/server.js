const express = require("express");

const path = require("path");

const app = express();

const PORT =
  process.env.PORT || 3000;


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  express.json()
);


app.use(
  express.urlencoded({
    extended: true
  })
);


// =====================================================
// SERVE FRONT-END FILES
// =====================================================

app.use(
  express.static(
    path.join(
      __dirname
    )
  )
);


// =====================================================
// DEFAULT PAGE
// =====================================================

app.get(
  "/",
  function(req, res) {

    res.sendFile(
      path.join(
        __dirname,
        "calendar.html"
      )
    );

  }
);


// =====================================================
// START SERVER
// =====================================================

app.listen(
  PORT,
  function() {

    console.log(
      `Lesson Planner running at http://localhost:${PORT}`
    );

  }
);