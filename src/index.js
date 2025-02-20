document.addEventListener('DOMContentLoaded', () => {
    const dogForm = document.getElementById("dog-form")
    const tableBody = document.getElementById("table-body")

    let currentDogId = null;
// fetch all the dogs and render them to the table
    function fetchDogs(){
        fetch(`http://localhost:3000/dogs`)
        .then(response => response.json())
        .then(dogs => {
            tableBody.innerHTML = ""
            dogs.forEach(dog => renderDogRow(dog))

        })
        .catch(error => console.error("Error fetching data from the server :",error))
    }

    // render a single dog row in the table 

    function renderDogRow(dog){
        const row = document.createElement("tr")
        row.innerHTML = `
        <td>${dog.name}</td>
        <td>${dog.breed}</td>
        <td>${dog.sex}</td>
        <td><button class = "edit-button" data-id = ${dog.id}">Edit</button></td>
        `
        //Add an event listener to handle the click of the edit button
        const editButton = row.querySelector(".edit-button") 
        editButton.addEventListener("click", () => populateForm(dog))

        tableBody.appendChild(row);
    }

    // create a function to populate and change
    function populateForm(dog) {
        currentDogId = dog.id;
        dogForm.name.value = dog.name;
        dogForm.breed.value = dog.breed;
        dogForm.sex.value = dog.sex;
    }

    // create a function to update the server in the event of a submit button 
    dogForm.addEventListener("submit",(e) => {
        e.preventDefault();

        const updatedDog = {
            name:dogForm.name.value,
            breed:dogForm.breed.value,
            sex:dogForm.sex.value,
        }

        if(currentDogId){
            updateDog(updatedDog,currentDogId)
        }
    })

    function updateDog(updatedDog,id){
        fetch(`http://localhost:3000/dogs/${id}`,{
            method : "PATCH",
            headers : {
                "Content-Type" : "application/json",
                Accept : "application/json"
            },
            body:JSON.stringify(updatedDog)

        })
        .then(response => response.json())
        .then( () => {
            fetchDogs(); //Refetch all the dogs from the server after it has been updated
            dogForm.reset();
            currentDogId = null; //reset the value of the constant 

        })
        .catch(error => console.error("Error updating data to the server :",error))
    }
    fetchDogs()  //fetch all dogs and render them on page load 
})