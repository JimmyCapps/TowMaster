// Fetch vehicle data from JSON file
fetch('vehicles.json')
    .then(function (response) { return response.json(); })
    .then(function (vehicleData) {
    // Populate the vehicle makes dropdown
    var makeDropdown = document.getElementById("makeDropdown");
    var modelDropdown = document.getElementById("modelDropdown");
    var yearDropdown = document.getElementById("yearDropdown");
    var vehicleSpecsDiv = document.getElementById("vehicleSpecs");
    var submitButton = document.getElementById("submitButton");
    var vehicleForm = document.getElementById("vehicleForm");
    var suitableCaravansDiv = document.getElementById("suitableCaravans");
    Object.keys(vehicleData).forEach(function (make) {
        var option = document.createElement("option");
        option.text = make;
        makeDropdown.add(option);
    });
    // Event listeners for make and model dropdowns
    makeDropdown.addEventListener("change", function () {
        var selectedMake = makeDropdown.value;
        populateModelDropdown(selectedMake);
    });
    modelDropdown.addEventListener("change", function () {
        var selectedMake = makeDropdown.value;
        var selectedModel = modelDropdown.value;
        populateYearDropdown(selectedMake, selectedModel);
    });
    yearDropdown.addEventListener("change", function () {
        var selectedMake = makeDropdown.value;
        var selectedModel = modelDropdown.value;
        var selectedYear = yearDropdown.value;
        displayVehicleSpecs(selectedMake, selectedModel, selectedYear);
    });
    // Function to populate the model dropdown based on the selected make
    function populateModelDropdown(selectedMake) {
        modelDropdown.innerHTML = '<option value="">Select a model</option>';
        yearDropdown.innerHTML = '<option value="">Select a year</option>';
        vehicleSpecsDiv.innerHTML = '';
        if (selectedMake && vehicleData[selectedMake]) {
            Object.keys(vehicleData[selectedMake]).forEach(function (model) {
                var option = document.createElement("option");
                option.text = model;
                modelDropdown.add(option);
            });
        }
    }
    // Function to populate the year dropdown based on the selected model
    function populateYearDropdown(selectedMake, selectedModel) {
        yearDropdown.innerHTML = '<option value="">Select a year</option>';
        vehicleSpecsDiv.innerHTML = '';
        if (selectedMake && selectedModel && vehicleData[selectedMake][selectedModel]) {
            Object.keys(vehicleData[selectedMake][selectedModel]).forEach(function (year) {
                var option = document.createElement("option");
                option.text = year;
                yearDropdown.add(option);
            });
        }
    }
    // Function to display vehicle specifications based on the selected make, model, and year
    function displayVehicleSpecs(selectedMake, selectedModel, selectedYear) {
        vehicleSpecsDiv.innerHTML = '';
        if (selectedMake && selectedModel && selectedYear && vehicleData[selectedMake] && vehicleData[selectedMake][selectedModel] && vehicleData[selectedMake][selectedModel][selectedYear]) {
            var specs = vehicleData[selectedMake][selectedModel][selectedYear];
            var specsHTML = "\n                    <h2>Vehicle Specifications</h2>\n                    <p><strong>GCM:</strong> ".concat(specs.gcm, "</p>\n                    <p><strong>GVM:</strong> ").concat(specs.gvm, "</p>\n                    <p><strong>Tow Ball Weight:</strong> ").concat(specs.towBallWeight, "</p>\n                    <p><strong>Braked Towing Capacity:</strong> ").concat(specs.brakedTowingCapacity, "</p>\n                    <p><strong>Unbraked Towing Capacity:</strong> ").concat(specs.unbrakedTowingCapacity, "</p>\n                ");
            vehicleSpecsDiv.innerHTML = specsHTML;
            // Show submit button
            submitButton.style.display = "block";
        }
    }
    // Event listener for form submission
    vehicleForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from submitting and reloading the page
        // Get the selected vehicle's specifications
        var selectedMake = document.getElementById("makeDropdown").value;
        var selectedModel = document.getElementById("modelDropdown").value;
        var selectedYear = document.getElementById("yearDropdown").value;
        // Ensure a valid selection
        if (selectedMake && selectedModel && selectedYear && vehicleData[selectedMake] && vehicleData[selectedMake][selectedModel] && vehicleData[selectedMake][selectedModel][selectedYear]) {
            var vehicleSpecs_1 = vehicleData[selectedMake][selectedModel][selectedYear];
            // Fetch caravan data from JSON file
            fetch('caravans.json')
                .then(function (response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
                .then(function (data) {
                var caravans = data.caravans;
                // Filter suitable caravans based on vehicle specifications
                var suitableCaravans = caravans.filter(function (caravan) {
                    return parseInt(caravan.towBallWeight) <= parseInt(vehicleSpecs_1.towBallWeight) &&
                        parseInt(caravan.grossWeight) <= parseInt(vehicleSpecs_1.gvm) &&
                        parseInt(caravan.grossWeight) <= parseInt(vehicleSpecs_1.gcm) &&
                        parseInt(caravan.tareWeight) <= parseInt(vehicleSpecs_1.brakedTowingCapacity);
                });
                // Display suitable caravans
                suitableCaravansDiv.innerHTML = '';
                if (suitableCaravans.length > 0) {
                    var heading = document.createElement("h2");
                    heading.textContent = "Suitable Caravans";
                    suitableCaravansDiv.appendChild(heading);
                    suitableCaravans.forEach(function (caravan) {
                        var caravanDiv = document.createElement("div");
                        var makeParagraph = document.createElement("p");
                        makeParagraph.innerHTML = "<strong>Make:</strong> ".concat(caravan.make);
                        caravanDiv.appendChild(makeParagraph);
                        var modelParagraph = document.createElement("p");
                        modelParagraph.innerHTML = "<strong>Model:</strong> ".concat(caravan.model);
                        caravanDiv.appendChild(modelParagraph);
                        var tareWeightParagraph = document.createElement("p");
                        tareWeightParagraph.innerHTML = "<strong>Tare Weight:</strong> ".concat(caravan.tareWeight);
                        caravanDiv.appendChild(tareWeightParagraph);
                        var grossWeightParagraph = document.createElement("p");
                        grossWeightParagraph.innerHTML = "<strong>Gross Weight:</strong> ".concat(caravan.grossWeight);
                        caravanDiv.appendChild(grossWeightParagraph);
                        var towBallWeightParagraph = document.createElement("p");
                        towBallWeightParagraph.innerHTML = "<strong>Tow Ball Weight:</strong> ".concat(caravan.towBallWeight);
                        caravanDiv.appendChild(towBallWeightParagraph);
                        var hr = document.createElement("hr");
                        caravanDiv.appendChild(hr);
                        suitableCaravansDiv.appendChild(caravanDiv);
                    });
                }
                else {
                    suitableCaravansDiv.innerHTML = '<p>No suitable caravans found.</p>';
                }
            })
                .catch(function (error) { return console.error('Error fetching or parsing caravan data:', error); });
        }
        else {
            console.error('Selected vehicle not found in the data');
        }
    });
});
