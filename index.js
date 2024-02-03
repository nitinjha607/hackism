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

function redirectToRoom(event) {
  var target = event.target;
  if (target.tagName === "LI") {
    var roomId = target.getAttribute("data-room-id");
    if (roomId) {
      // Redirect to the room page in a new tab
      createRoomHTML(roomId);
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
            <!-- Add more content as needed -->

            <script>
                // You can include additional JavaScript for the room page here
            </script>
        </body>
        </html>
    `;

  // Create a Blob and generate a download link
  var blob = new Blob([roomContent], { type: "text/html" });
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `room_${roomId}.html`;
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
