// index.js

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

function updateRoomList() {
  var roomListElement = document.getElementById("roomList");
  roomListElement.innerHTML = "";

  // Iterate through local storage and display each room
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var roomData = JSON.parse(localStorage.getItem(key));

    var listItem = document.createElement("li");
    listItem.textContent = `${roomData.name} - Created on: ${roomData.date}`;
    listItem.setAttribute("data-room-id", roomData.id);
    roomListElement.appendChild(listItem);
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
      // Ask the user if they want to view or delete the room
      var action = prompt(
        "Enter 'view' to view the room, 'delete' to delete it:"
      );
      if (action === "view") {
        // Redirect to the room page in a new tab
        createRoomHTML(roomId);
      } else if (action === "delete") {
        // Delete the room
        deleteRoom(roomId);
      } else {
        alert("Invalid action. Please enter 'view' or 'delete'.");
      }
    }
  }
}

function createRoomHTML(roomId) {
  var roomData = JSON.parse(localStorage.getItem(roomId));

  // Construct the content for the new tab
  var roomContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${roomData.name}</title>
    </head>
    <body>
        <h1>${roomData.name}</h1>
        <p>Room ID: ${roomData.id}</p>
        <p>Created on: ${roomData.date}</p>

        <h2>Post a Doubt</h2>
        <form id="postForm">
            <textarea id="postText" placeholder="Type your doubt..."></textarea>
            <input type="file" id="imageInput" accept="image/*">
            <button type="button" onclick="postDoubt()">Post</button>
        </form>

        <h2>Doubts</h2>
        <ul id="doubtList"></ul>

        <script>
            function postDoubt() {
                var postText = document.getElementById("postText").value.trim();
                var imageInput = document.getElementById("imageInput");
                var imageFile = imageInput.files[0];

                // You can implement logic to handle the posted doubt and image here
                // For simplicity, let's just display the doubt in the doubt list
                var doubtList = document.getElementById("doubtList");
                var listItem = document.createElement("li");
                listItem.textContent = postText;
                doubtList.appendChild(listItem);

                // Clear the input fields after posting
                document.getElementById("postText").value = "";
                imageInput.value = "";
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
