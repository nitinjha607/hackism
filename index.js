// index.js

// Define the postDoubt function in the global scope
function postDoubt(roomId) {
  var postText = document.getElementById("postText").value.trim();
  var imageInput = document.getElementById("imageInput");
  var imageFile = imageInput.files[0];

  // Create a new doubt object
  var newDoubt = {
    text: postText,
    image: imageFile ? URL.createObjectURL(imageFile) : null,
  };

  // Load existing doubts from local storage
  var existingDoubts =
    JSON.parse(localStorage.getItem(`${roomId}_doubts`)) || [];

  // Add the new doubt
  existingDoubts.push(newDoubt);

  // Save doubts to local storage
  localStorage.setItem(`${roomId}_doubts`, JSON.stringify(existingDoubts));

  // Display the new doubt in the doubt list
  displayDoubt(newDoubt);
}

// ...

function displayDoubt(doubt) {
  var doubtList = document.getElementById("doubtList");
  var listItem = document.createElement("li");
  listItem.innerHTML = doubt.text;

  if (doubt.image) {
    var img = document.createElement("img");
    // Use an absolute path for the image
    img.src = new URL(doubt.image, document.baseURI).href;
    listItem.appendChild(img);
  }

  // Display answers section
  var answersSection = document.createElement("div");
  answersSection.innerHTML = "<h3>Answers</h3>";

  // Display existing answers
  doubt.answers.forEach(function (answer) {
    var answerItem = document.createElement("p");
    answerItem.innerHTML = answer.text;

    if (answer.image) {
      var answerImg = document.createElement("img");
      answerImg.src = answer.image;
      answerItem.appendChild(answerImg);
    }

    answersSection.appendChild(answerItem);
  });

  // Create a form for posting answers
  var answerForm = document.createElement("form");
  answerForm.id = "answerForm";
  var answerText = document.createElement("textarea");
  answerText.id = "answerText";
  answerText.placeholder = "Type your answer...";
  var answerImageInput = document.createElement("input");
  answerImageInput.type = "file";
  answerImageInput.id = "answerImageInput";
  answerImageInput.accept = "image/*";
  var answerButton = document.createElement("button");
  answerButton.type = "button";
  answerButton.textContent = "Post Answer";
  answerButton.onclick = function () {
    postAnswer(doubt.roomId, doubt.text);
  };

  // Append form elements to the form
  answerForm.appendChild(answerText);
  answerForm.appendChild(answerImageInput);
  answerForm.appendChild(answerButton);

  // Append the form to the answers section
  answersSection.appendChild(answerForm);

  // Append the answers section to the doubt item
  listItem.appendChild(answersSection);

  var deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function () {
    listItem.parentNode.removeChild(listItem);
    // Update local storage after deleting a doubt
    updateLocalStorage(
      `${doubt.roomId}_doubts`,
      existingDoubts.filter(function (d) {
        return d.text !== doubt.text;
      })
    );
  };
  listItem.appendChild(deleteButton);

  doubtList.appendChild(listItem);

  // Clear the input fields after posting
  document.getElementById("postText").value = "";
  imageInput.value = "";
}

function postAnswer(roomId, doubtText) {
  var answerText = document.getElementById("answerText").value.trim();
  var answerImageInput = document.getElementById("answerImageInput");
  var answerImageFile = answerImageInput.files[0];

  // Create a new answer object
  var newAnswer = {
    text: answerText,
    image: answerImageFile ? URL.createObjectURL(answerImageFile) : null,
  };

  // Load existing doubts from local storage
  var existingDoubts = JSON.parse(localStorage.getItem(`${roomId}_doubts`)) || [];

  // Find the doubt to which the answer belongs
  var targetedDoubt = existingDoubts.find(function (d) {
    return d.text === doubtText;
  });

  // Add the new answer to the targeted doubt
  if (targetedDoubt) {
    targetedDoubt.answers = targetedDoubt.answers || [];
    targetedDoubt.answers.push(newAnswer);
  }

  // Save doubts to local storage
  updateLocalStorage(`${roomId}_doubts`, existingDoubts);

  // Display the new answer in the answers section
  displayAnswer(newAnswer);
}

function displayAnswer(answer) {
  // Create a paragraph for the new answer
  var answerItem = document.createElement("p");
  answerItem.innerHTML = answer.text;

  if (answer.image) {
    // Use an absolute path for the image
    answerImg.src = new URL(answer.image, document.baseURI).href;
    answerItem.appendChild(answerImg);
  }


  // Append the new answer to the answers section
  var answersSection = document.querySelector("#doubtList li:last-child div");
  if (answersSection) {
    answersSection.appendChild(answerItem);
  }

  // Clear the input fields after posting
  document.getElementById("answerText").value = "";
  document.getElementById("answerImageInput").value = "";
}

// ...


function updateLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createRoom() {
  var roomName = document.getElementById("roomName").value.trim();

  if (roomName === "") {
    alert("Please enter a valid room name.");
    return;
  }

  var currentDate = new Date();
  var dateString = currentDate.toLocaleString();

  // Create a unique identifier for the room
  var roomId = "room_" + currentDate.getTime();

  try {
    // Store room information in local storage
    var roomData = {
      id: roomId,
      name: roomName,
      date: dateString,
    };

    localStorage.setItem(roomId, JSON.stringify(roomData));

    // Update the room list on the webpage
    updateRoomList();

    // Clear the input field
    document.getElementById("roomName").value = "";

    console.log("Room created successfully:", roomData);
  } catch (error) {
    console.error("Error creating room:", error);
    alert("An error occurred while creating the room. Please try again.");
  }
}

// Update the room list on the webpage
function updateRoomList() {
  var roomListElement = document.getElementById("roomList");
  roomListElement.innerHTML = "";

  // Iterate through local storage and display each room
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    // Check if the key represents a room (exclude doubts)
    if (key.startsWith("room_")) {
      var roomData = JSON.parse(localStorage.getItem(key));

      var listItem = document.createElement("li");
      listItem.textContent = roomData.name;
      listItem.setAttribute("data-room-id", roomData.id);
      roomListElement.appendChild(listItem);
    }
  }
}

function deleteRoom(roomId) {
  // Ensure roomId is provided
  if (!roomId) {
    console.error("Room ID is required for deletion.");
    return;
  }

  // Ask for confirmation before deleting the room
  var confirmation = confirm("Are you sure you want to delete this room?");
  if (!confirmation) {
    return;
  }

  try {
    // Remove room from local storage
    localStorage.removeItem(roomId);

    // Remove doubts for the room from local storage
    localStorage.removeItem(`${roomId}_doubts`);

    // Update the room list on the webpage
    updateRoomList();

    console.log("Room deleted successfully:", roomId);
  } catch (error) {
    console.error("Error deleting room:", error);
    alert("An error occurred while deleting the room. Please try again.");
  }
}

// Modify the redirectToRoom function to include delete functionality
function redirectToRoom(event) {
  var target = event.target;
  if (target.tagName === "LI") {
    var roomId = target.getAttribute("data-room-id");
    if (roomId) {
      // Ask the user if they want to view, delete, or post in the room
      var action = prompt(
        "Enter 'delete' to delete it, or 'post' to post in it:"
      );
      if (action === "view") {
        // Redirect to the room page in a new tab
        createRoomHTML(roomId);
      } else if (action === "delete") {
        // Delete the room
        deleteRoom(roomId);
      } else if (action === "post") {
        // Post in the room
        postInRoom(roomId);
      } else {
        alert("Invalid action. Please enter 'view', 'delete', or 'post'.");
      }
    }
  }
}

function postInRoom(roomId) {
  var roomData = JSON.parse(localStorage.getItem(roomId));

  // Construct the content for the new tab with the ability to post and delete
  var roomContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${roomData.name}</title>
        <link rel="stylesheet" href="style1.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
            integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
            crossorigin="anonymous" referrerpolicy="no-referrer" />
    </head>
    <body>
        <h1>${roomData.name}</h1>
        <p>Room ID: ${roomData.id}</p>
        <p>Created on: ${roomData.date}</p>

        <h2>Post a Doubt</h2>
        <form id="postForm">
            <textarea id="postText" placeholder="Type your doubt..."></textarea>
            <input type="file" id="imageInput" accept="image/*">
            <button type="button" onclick="postDoubt('${roomId}')">Post</button>
        </form>

        <h2>Doubts</h2>
        <ul id="doubtList"></ul>

        <script>
            // Load and display existing doubts from local storage
            document.addEventListener("DOMContentLoaded", function () {
                var existingDoubts = JSON.parse(localStorage.getItem("${roomId}_doubts")) || [];
                var doubtList = document.getElementById("doubtList");

                existingDoubts.forEach(function (doubt) {
                    displayDoubt(doubt);
                });
            });

            // Use the globally defined postDoubt function
            function postDoubt(roomId) {
                var postText = document.getElementById("postText").value.trim();
                var imageInput = document.getElementById("imageInput");
                var imageFile = imageInput.files[0];

                // Create a new doubt object
                var newDoubt = {
                    text: postText,
                    image: imageFile ? URL.createObjectURL(imageFile) : null
                };

                // Load existing doubts from local storage
                var existingDoubts = JSON.parse(localStorage.getItem("${roomId}_doubts")) || [];

                // Add the new doubt
                existingDoubts.push(newDoubt);

                // Save doubts to local storage
                updateLocalStorage("${roomId}_doubts", existingDoubts);

                // Display the new doubt in the doubt list
                displayDoubt(newDoubt);
            }

            function displayDoubt(doubt) {
                var doubtList = document.getElementById("doubtList");
                var listItem = document.createElement("li");
                listItem.innerHTML = doubt.text;

                if (doubt.image) {
                    var img = document.createElement("img");
                    img.src = doubt.image;
                    listItem.appendChild(img);
                }

                var deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.onclick = function () {
                    listItem.parentNode.removeChild(listItem);
                    // Update local storage after deleting a doubt
                    updateLocalStorage("${roomId}_doubts", existingDoubts.filter(function (d) {
                        return d.text !== doubt.text;
                    }));
                };
                listItem.appendChild(deleteButton);

                doubtList.appendChild(listItem);
            }

            function updateLocalStorage(key, value) {
                localStorage.setItem(key, JSON.stringify(value));
            }
        </script>
    </body>
    </html>
  `;

  // Create a Blob and generate a download link
  var blob = new Blob([roomContent], { type: "text/html" });
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.click();
  // Open a new tab with the room content
  var newTab = window.open();
  newTab.document.write(roomContent);
}

// Attach event handlers after the DOM has loaded
document.addEventListener("DOMContentLoaded", function () {
  var createRoomBtn = document.getElementById("createRoomBtn");
  createRoomBtn.onclick = createRoom;

  var logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.onclick = function () {
    // Redirect to login.html when the logout button is clicked
    window.location.href = "login.html";
  };
  // Initially load the room list when the page loads
  updateRoomList();
});
