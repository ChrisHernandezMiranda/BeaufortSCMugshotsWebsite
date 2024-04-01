function toggleSort() {
    var dropdownContent = document.getElementById("sortDropdown");
    if (dropdownContent) {
        dropdownContent.classList.toggle("show");
    }
    
    // Hide dropdown content when clicking outside the sort dropdown
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.sort-dropdown img')) {
            dropdownContent.classList.remove('show');
        }
    });
}


document.addEventListener('DOMContentLoaded', function () {
    let currentJsonFile; // Variable to store the currently displayed JSON file
    const footer = document.querySelector('.footer'); // Move the declaration outside the event listener
    footer.style.display = 'none'; // Set the initial display of the footer

    // Default view: 72 Hours
    currentJsonFile = '4_1_24 72hours.json';
    changeHeaderText("Booked Within the Last 72 Hours");
    // Fetch data for the last 72 hours
    fetch72HoursData();

    // Event listener for the "72 Hours" label
    document.getElementById('seventyTwoHoursNav').addEventListener('click', function () {
        currentJsonFile = '4_1_24 72hours.json';
        // Clear the grid container
        clearGrid();

        changeHeaderText("Booked Within the Last 72 Hours");
        // Fetch data for the last 72 hours
        fetch72HoursData();
    });

    // Event listener for the "90 Days" label
    document.getElementById('ninetyDaysNav').addEventListener('click', function () {
        currentJsonFile = '';
        // Clear the grid container
        clearGrid();
        changeHeaderText("Booked Within the Last 90 Days");
        // Fetch data for the last 90 days
        fetch90DaysData();
    });

    // Event listener for the "15 Days" label
    document.getElementById('fifteenDaysNav').addEventListener('click', function () {
        currentJsonFile = '';
        // Clear the grid container
        clearGrid();
        changeHeaderText("Booked Within the Last 15 Days");
        // Fetch data for the last 15 days
        fetch15DaysData();
    });

    // Event listener for search input
    document.getElementById('search-bar').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const searchTerm = this.value.trim().toLowerCase();
            searchPeople(searchTerm);
        }
    });

    // Event listener for sorting by name
    document.getElementById('name').addEventListener('click', function () {
        event.preventDefault(); 
        sortByName();
    });

    // Event listener for sorting by date
document.getElementById('date').addEventListener('click', function () {
    event.preventDefault();
    sortByDate();
});
   
    // Function to clear the grid container
    function clearGrid() {
        const gridContainer = document.querySelector('.grid-container');
        gridContainer.innerHTML = ''; // Clear the HTML content inside the grid container
    }

    function changeHeaderText(text) {
        const headerText = document.querySelector('.highlight');
        headerText.textContent = text;
    }

    // Function to fetch data for the last 72 hours
    function fetch72HoursData() {
        fetch('4_1_24 72hours.json') // Change the URL to fetch data for the last 72 hours
            .then(response => response.json())
            .then(data => {
                // Loop through the wanted_people array
                data.wanted_people.forEach(person => {
                    // Get the mugshotImage URL for each person
                    const mugshotImage = person.warrants[0].mugshotImage;
                    const personName = person.name.first + ' ' + person.name.last;
                    // Append the image to the grid
                    appendImages(mugshotImage, personName, person, person.bookingDate);
                });
            })
            .catch(error => console.error('Error fetching JSON file:', error));
    }

    // Function to fetch data for the last 90 days
    function fetch90DaysData() {
        fetch('4_1_24 90days.json') // Fetch data for the last 90 days
            .then(response => response.json())
            .then(data => {
                // Loop through the wanted_people array
                data.wanted_people.forEach(person => {
                    // Get the mugshotImage URL for each person
                    const mugshotImage = person.warrants[0].mugshotImage;
                    const personName = person.name.first + ' ' + person.name.last;
                    // Append the image to the grid
                    appendImages(mugshotImage, personName, person, person.bookingDate);
                });
            })
            .catch(error => console.error('Error fetching JSON file:', error));
    }


    function fetch15DaysData() {
        fetch('4_1_24 15days.json') // Fetch data for the last 90 days
            .then(response => response.json())
            .then(data => {
                // Loop through the wanted_people array
                data.wanted_people.forEach(person => {
                    // Get the mugshotImage URL for each person
                    const mugshotImage = person.warrants[0].mugshotImage;
                    const personName = person.name.first + ' ' + person.name.last;
                    // Append the image to the grid
                    appendImages(mugshotImage, personName, person, person.bookingDate);
                });
            })
            .catch(error => console.error('Error fetching JSON file:', error));
    }



    // Function to populate the modal with details of the selected person
    function populateModal(person) {
        // Get the modal element
        const modal = document.getElementById("myModal");

        // Set the image source in the modal
        const modalImg = modal.querySelector(".modal-content");
        modalImg.src = person.warrants[0].mugshotImage;
        modalImg.onerror = function () {
            // If the image fails to load, set the source to the generic mugshot photo
            modalImg.src = "mugshot-generic.png"; // Provide the path to your generic mugshot photo
        };

        // Populate other details in the modal
        const chargesTable = modal.querySelector("#chargesTable");
        chargesTable.innerHTML = ''; // Clear previous table content
        chargesTable.innerHTML += `
      <tr>
        <td>Name:</td>
        <td>${person.name.first} ${person.name.last}</td>
    </tr>
    <tr>
        <td>Date of Birth:</td>
        <td>${person.dob}</td>
    </tr>
    <tr>
        <td>Race:</td>
        <td>${person.raceGender}</td>
    </tr>
    <tr>
        <td>Height:</td>
        <td>${person.height}</td>
    </tr>
    <tr>
        <td>Weight:</td>
        <td>${person.weight} lbs</td>
    </tr>
    <tr>
        <td>Address:</td>
        <td>${person.address.street}, ${person.address.cityStateZip}</td>
    </tr>
    <tr>
        <td>Booking Time/Date:</td>
        <td>${person.bookingDate}</td>
    </tr>
    <tr>
        <td>Booking Number:</td>
        <td>${person.bookingNumber}</td>
    </tr>
    <tr>
        <td>Arrest Agency:</td>
        <td>${person.warrants[0].arrestAgency}</td>
    </tr>
    <tr>
        <td>Arrest Officer:</td>
        <td>${person.warrants[0].arrestOfficer}</td>
    </tr>
    <tr>
        <td>Offenses:</td>
        <td>
            <ul>
                ${person.warrants[0].offenses.map(offense => `<li>${offense}</li>`).join('')}
            </ul>
        </td>
    </tr>
    `;
    chargesTable.style.display = 'table';

        // Display the modal
        modal.style.display = "block";
    }

    // Function to append images to the grid
    function appendImages(url, name, person, bookingDate) {
        // Create the image element
        const img = document.createElement('img');
        img.src = url; // Set the source URL
        img.alt = name; // Set the alt attribute for accessibility

        img.onerror = function () {
            // Set the source to the generic mugshot photo
            img.src = 'mugshot-generic.png'; // Provide the path to your generic mugshot photo
            img.alt = 'Mugshot Not Available'; // Update alt text if needed
        };

        // Create a container for the image and name
        const container = document.createElement('div');
        container.classList.add('image-container');
        container.dataset.bookingDate = bookingDate; // Set the booking date as a data attribute

        // Append the image to the container
        container.appendChild(img);

        // Create a paragraph element for the person's name
        const nameParagraph = document.createElement('p');
        nameParagraph.textContent = name;

        // Append the name paragraph to the container
        container.appendChild(nameParagraph);

        // Append the container to the grid
        document.querySelector('.grid-container').appendChild(container);

        // Add click event listener to the image for showing modal
        img.addEventListener('click', function () {
            populateModal(person);
        });
    }

    // Function to search people based on the given term
    function searchPeople(term) {
        // Clear the grid container
        clearGrid();

        // Fetch data for the last 72 hours
        fetch72HoursDataWithSearch(term);

        // Fetch data for the last 90 days
        fetch90DaysDataWithSearch(term);

        fetch15DaysDataWithSearch(term);
    }

    // Function to fetch data for the last 72 hours with search term
    function fetch72HoursDataWithSearch(term) {
        fetch('4_1_24 72hours.json') // Change the URL to fetch data for the last 72 hours
            .then(response => response.json())
            .then(data => {
                // Filter the wanted_people array based on the search term
                const filteredPeople = data.wanted_people.filter(person => {
                    const fullName = person.name.first.toLowerCase() + ' ' + person.name.last.toLowerCase();
                    return fullName.includes(term);
                });

                // Append images for filtered people
                filteredPeople.forEach(person => {
                    const mugshotImage = person.warrants[0].mugshotImage;
                    const personName = person.name.first + ' ' + person.name.last;
                    appendImages(mugshotImage, personName, person, person.bookingDate);
                });
            })
            .catch(error => console.error('Error fetching JSON file:', error));
    }

    // Function to fetch data for the last 90 days with search term
    function fetch90DaysDataWithSearch(term) {
        fetch('4_1_24 90days.json') // Fetch data for the last 90 days
            .then(response => response.json())
            .then(data => {
                // Filter the wanted_people array based on the search term
                const filteredPeople = data.wanted_people.filter(person => {
                    const fullName = person.name.first.toLowerCase() + ' ' + person.name.last.toLowerCase();
                    return fullName.includes(term);
                });

                // Append images for filtered people
                filteredPeople.forEach(person => {
                    const mugshotImage = person.warrants[0].mugshotImage;
                    const personName = person.name.first + ' ' + person.name.last;
                    appendImages(mugshotImage, personName, person, person.bookingDate);
                });
            })
            .catch(error => console.error('Error fetching JSON file:', error));
    }

    function fetch15DaysDataWithSearch(term) {
        fetch('4_1_24 15days.json') // Fetch data for the last 90 days
            .then(response => response.json())
            .then(data => {
                // Filter the wanted_people array based on the search term
                const filteredPeople = data.wanted_people.filter(person => {
                    const fullName = person.name.first.toLowerCase() + ' ' + person.name.last.toLowerCase();
                    return fullName.includes(term);
                });

                // Append images for filtered people
                filteredPeople.forEach(person => {
                    const mugshotImage = person.warrants[0].mugshotImage;
                    const personName = person.name.first + ' ' + person.name.last;
                    appendImages(mugshotImage, personName, person, person.bookingDate);
                });
            })
            .catch(error => console.error('Error fetching JSON file:', error));
    }

   // Function to sort people by last name
function sortByName() {
    const gridContainer = document.querySelector('.grid-container');
    const images = Array.from(gridContainer.querySelectorAll('.image-container'));
    images.sort((a, b) => {
        const lastNameA = a.querySelector('p').textContent.split(' ')[1].toLowerCase();
        const lastNameB = b.querySelector('p').textContent.split(' ')[1].toLowerCase();
        return lastNameA.localeCompare(lastNameB);
    });
    clearGrid();
    images.forEach(image => gridContainer.appendChild(image));
    document.getElementById('chargesTable').style.display = 'none';
}

    // Function to sort people by date
    function sortByDate() {
        const gridContainer = document.querySelector('.grid-container');
        const images = Array.from(gridContainer.querySelectorAll('.image-container'));
        images.sort((a, b) => {
            const dateA = new Date(a.dataset.bookingDate);
            const dateB = new Date(b.dataset.bookingDate);
            return dateB - dateA;
        });
        clearGrid();
        images.forEach(image => gridContainer.appendChild(image));
        document.getElementById('chargesTable').style.display = 'none';
    }

    // Close the modal when clicking on the close button
    document.querySelector(".close").onclick = function () {
        document.getElementById("myModal").style.display = "none";
    };

    // Close the modal when clicking outside of the modal
    window.onclick = function (event) {
        const modal = document.getElementById("myModal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
    window.addEventListener('scroll', function () {
        // Calculate the distance from the top of the page to the bottom of the viewport
        const distanceToBottom = document.documentElement.offsetHeight - (window.innerHeight + window.scrollY);
    
        // Adjust a threshold value to ensure consistency in displaying the footer
        const threshold = 100; // Adjust this value as needed
    
        // If the distance to the bottom is less than or equal to the threshold, display the footer
        if (distanceToBottom <= threshold) {
            footer.style.display = 'block';
        } else {
            // Otherwise, hide the footer
            footer.style.display = 'none';
        }
    });
});
