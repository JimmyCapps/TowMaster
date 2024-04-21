// Define interface for vehicle specifications
interface VehicleSpecs {
    gcm: string;
    gvm: string;
    towBallWeight: string;
    brakedTowingCapacity: string;
    unbrakedTowingCapacity: string;
}

// Define interface for caravan specifications
interface CaravanSpecs {
    make: string;
    model: string;
    tareWeight: string;
    grossWeight: string;
    towBallWeight: string;
}
// Fetch vehicle data from JSON file
fetch('vehicles.json')
    .then(response => response.json())
    .then((vehicleData: {[make: string]: {[model: string]: {[year: string]: VehicleSpecs}}}) => {
        // Populate the vehicle makes dropdown
        const makeDropdown = document.getElementById("makeDropdown") as HTMLSelectElement;
        const modelDropdown = document.getElementById("modelDropdown") as HTMLSelectElement;
        const yearDropdown = document.getElementById("yearDropdown") as HTMLSelectElement;
        const vehicleSpecsDiv = document.getElementById("vehicleSpecs");
        const submitButton = document.getElementById("submitButton") as HTMLButtonElement;
        const vehicleForm = document.getElementById("vehicleForm") as HTMLFormElement;
        const suitableCaravansDiv = document.getElementById("suitableCaravans");

        Object.keys(vehicleData).forEach(make => {
            const option = document.createElement("option");
            option.text = make;
            makeDropdown.add(option);
        });

        // Event listeners for make and model dropdowns
        makeDropdown.addEventListener("change", function() {
            const selectedMake = makeDropdown.value;
            populateModelDropdown(selectedMake);
        });

        modelDropdown.addEventListener("change", function() {
            const selectedMake = makeDropdown.value;
            const selectedModel = modelDropdown.value;
            populateYearDropdown(selectedMake, selectedModel);
        });

        yearDropdown.addEventListener("change", function() {
            const selectedMake = makeDropdown.value;
            const selectedModel = modelDropdown.value;
            const selectedYear = yearDropdown.value;
            displayVehicleSpecs(selectedMake, selectedModel, selectedYear);
        });

        // Function to populate the model dropdown based on the selected make
        function populateModelDropdown(selectedMake: string) {
            modelDropdown.innerHTML = '<option value="">Select a model</option>';
            yearDropdown.innerHTML = '<option value="">Select a year</option>';
            vehicleSpecsDiv.innerHTML = '';

            if (selectedMake && vehicleData[selectedMake]) {
                Object.keys(vehicleData[selectedMake]).forEach(model => {
                    const option = document.createElement("option");
                    option.text = model;
                    modelDropdown.add(option);
                });
            }
        }

        // Function to populate the year dropdown based on the selected model
        function populateYearDropdown(selectedMake: string, selectedModel: string) {
            yearDropdown.innerHTML = '<option value="">Select a year</option>';
            vehicleSpecsDiv.innerHTML = '';

            if (selectedMake && selectedModel && vehicleData[selectedMake][selectedModel]) {
                Object.keys(vehicleData[selectedMake][selectedModel]).forEach(year => {
                    const option = document.createElement("option");
                    option.text = year;
                    yearDropdown.add(option);
                });
            }
        }

        // Function to display vehicle specifications based on the selected make, model, and year
        function displayVehicleSpecs(selectedMake: string, selectedModel: string, selectedYear: string) {
            vehicleSpecsDiv.innerHTML = '';

            if (selectedMake && selectedModel && selectedYear && vehicleData[selectedMake] && vehicleData[selectedMake][selectedModel] && vehicleData[selectedMake][selectedModel][selectedYear]) {
                const specs = vehicleData[selectedMake][selectedModel][selectedYear];
                const specsHTML = `
                    <h2>Vehicle Specifications</h2>
                    <p><strong>GCM:</strong> ${specs.gcm}</p>
                    <p><strong>GVM:</strong> ${specs.gvm}</p>
                    <p><strong>Tow Ball Weight:</strong> ${specs.towBallWeight}</p>
                    <p><strong>Braked Towing Capacity:</strong> ${specs.brakedTowingCapacity}</p>
                    <p><strong>Unbraked Towing Capacity:</strong> ${specs.unbrakedTowingCapacity}</p>
                `;
                vehicleSpecsDiv.innerHTML = specsHTML;

                // Show submit button
                submitButton.style.display = "block";
            }
        }

        // Event listener for form submission
        vehicleForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent the form from submitting and reloading the page
        
            // Get the selected vehicle's specifications
            const selectedMake = (document.getElementById("makeDropdown") as HTMLSelectElement).value;
            const selectedModel = (document.getElementById("modelDropdown") as HTMLSelectElement).value;
            const selectedYear = (document.getElementById("yearDropdown") as HTMLSelectElement).value;
        
            // Ensure a valid selection
            if (selectedMake && selectedModel && selectedYear && vehicleData[selectedMake] && vehicleData[selectedMake][selectedModel] && vehicleData[selectedMake][selectedModel][selectedYear]) {
                const vehicleSpecs = vehicleData[selectedMake][selectedModel][selectedYear];
        
                // Fetch caravan data from JSON file
                fetch('caravans.json')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then((data: { caravans: CaravanSpecs[] }) => {
                        const caravans = data.caravans;
        
                        // Filter suitable caravans based on vehicle specifications
                        const suitableCaravans = caravans.filter(caravan =>
                            parseInt(caravan.towBallWeight) <= parseInt(vehicleSpecs.towBallWeight) &&
                            parseInt(caravan.grossWeight) <= parseInt(vehicleSpecs.gvm) &&
                            parseInt(caravan.grossWeight) <= parseInt(vehicleSpecs.gcm) &&
                            parseInt(caravan.tareWeight) <= parseInt(vehicleSpecs.brakedTowingCapacity)
                        );
        
                        // Display suitable caravans
                        suitableCaravansDiv.innerHTML = '';
                        if (suitableCaravans.length > 0) {
                            const heading = document.createElement("h2");
                            heading.textContent = "Suitable Caravans";
                            suitableCaravansDiv.appendChild(heading);
        
                            suitableCaravans.forEach(caravan => {
                                const caravanDiv = document.createElement("div");
        
                                const makeParagraph = document.createElement("p");
                                makeParagraph.innerHTML = `<strong>Make:</strong> ${caravan.make}`;
                                caravanDiv.appendChild(makeParagraph);
        
                                const modelParagraph = document.createElement("p");
                                modelParagraph.innerHTML = `<strong>Model:</strong> ${caravan.model}`;
                                caravanDiv.appendChild(modelParagraph);
        
                                const tareWeightParagraph = document.createElement("p");
                                tareWeightParagraph.innerHTML = `<strong>Tare Weight:</strong> ${caravan.tareWeight}`;
                                caravanDiv.appendChild(tareWeightParagraph);
        
                                const grossWeightParagraph = document.createElement("p");
                                grossWeightParagraph.innerHTML = `<strong>Gross Weight:</strong> ${caravan.grossWeight}`;
                                caravanDiv.appendChild(grossWeightParagraph);
        
                                const towBallWeightParagraph = document.createElement("p");
                                towBallWeightParagraph.innerHTML = `<strong>Tow Ball Weight:</strong> ${caravan.towBallWeight}`;
                                caravanDiv.appendChild(towBallWeightParagraph);
        
                                const hr = document.createElement("hr");
                                caravanDiv.appendChild(hr);
        
                                suitableCaravansDiv.appendChild(caravanDiv);
                            });
                        } else {
                            suitableCaravansDiv.innerHTML = '<p>No suitable caravans found.</p>';
                        }
                    })
                    .catch(error => console.error('Error fetching or parsing caravan data:', error));
            } else {
                console.error('Selected vehicle not found in the data');
            }
        });
        


    });
