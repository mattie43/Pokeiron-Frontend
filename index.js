const centerColumn = document.querySelector('.center-column')
const leftColumn = document.querySelector('.left-column')
const scoreBoard = document.querySelector('.score-board')
const baseurl =   "http://localhost:3000/"
// Helper functions------------------------------------------------

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const arrayFromHTMLcollection = (HTMLcoll) => {
  new_array = []
  for (const e of HTMLcoll) {
    new_array.push((e.innerHTML).toLowerCase())
  }
  return new_array
}

//-----------------------------------------------------------------
centerColumn.addEventListener('submit', e => {
  e.preventDefault()
  
  if(e.target.className == 'login-form'){
    // fetch user, show them the starting page/choose pokemon - e.target.username.value
    userLogin(e.target.username.value)
    chooseStartingPokemon()
  }else if(e.target.id == 'starter-form'){
    newPlayerStart()
    getPokemon(e.target.name.value, e.target.dataset.species, e.target.dataset.id, 1)
  }else if(e.target.id == 'rename-form'){
    getPokemon(e.targe.name.value, e.target.dataset.species, e.target.dataset.id, 1)
    showCurrentLocation()
    e.target.remove()
  }
})

centerColumn.addEventListener('click', e => {
  if(e.target.className == 'pokemon-sprites'){
    showRenameForm(e.target.dataset.species, e.target.dataset.id)
  }else if(e.target.dataset.species){
    removePokeBall(e.target.dataset.species)
    showRenameForm(e.target.dataset.species, e.target.dataset.id)
  }
})

leftColumn.addEventListener('click', e => {
  if(e.target.id === 'hpup-li'){
    removeHpUp()
  }
})

document.addEventListener('keydown', e => {
  if(leftColumn.innerText != 'Log in first!' && e.key.slice(0, 5) == 'Arrow'){
    moveLocation(e.key.slice(5))
  }
})

// (ISA)Fetch Requests --------------------------------------------------------------------------------------------------------------------------------------------------------------------------



const getItem = (itemName, userId) => {
  let options = {
      method: "POST",
      headers: {"content-type": "application/json",
                "accept": "applicatio/json" },
      body: JSON.stringify({api_id: itemName,
            user_id: userId})
      }

    fetch(baseurl + `items`, options)
    .then(resp => resp.json())
    .then(item => renderItem(item))
}

const getPokemon = (name, species, pokeId, userId) => {


  let options = {
    method: "POST",
    headers: {"content-type": "application/json",
              "accept": "application/json"
    },
    body: JSON.stringify({name: name,
          species: species,
          user_id: userId
          })
  }

  fetch(baseurl + `pokemons/`, options)
  .then(resp => resp.json())
  .then(pokemon => addPokemon(pokemon, pokeId))
}

const userLogin = (name) => {

  let options = {
    method: "POST",
    headers: {"content-type": "application/json",
              "accept": "application/json"
    },
    body: JSON.stringify({name: name,
          })
  }

  // olTag = scoreBoard.querySelector("ol")
  // allUsers = arrayFromHTMLcollection(olTag.children)
  // if(allUsers.includes(toLowerCase(name)))

  fetch(baseurl+`users`, options)
  .then(resp => resp.json())
  .then(user => renderUser(user))

}

const getUsers = () => {

  fetch(baseurl+`users`)
  .then(resp => resp.json())
  .then(users => {
    users.forEach(user => {
      renderUser(user)
    });
  })

}

const renderUser = (user) => {
  const userLi = document.createElement("li")
  const olTag = scoreBoard.querySelector("ol")
  userLi.id = user.id
  userLi.dataset.maxHp = user.max_hp
  userLi.dataset.currentHp = user.current_hp
  userLi.textContent = `${user.name}`
  olTag.append(userLi)
}

const renderItem = (item) => {
  const itemLi = document.createElement('li')
  document.getElementById('inventory-ul').append(itemLi)
  itemLi.id = item.api_id
  itemLi.innerHTML = `<img src="${item.img_url}" class="inventory-sprite"> ${item.name} <span id="pokeball-amount">x${item.amount}</span>`
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function showRenameForm(pokemonSpecies, pokemonId) {
  if(centerColumn.querySelector('#starter-form')){
    centerColumn.querySelector('#starter-form').className = ''
  }else{
    centerColumn.querySelector('#rename-form').className = ''
  }
  const renameLabel = centerColumn.querySelector('#rename-label')
  renameLabel.innerText = `What would you like to name ${pokemonSpecies}?`
  renameLabel.parentNode.parentNode.dataset.species = pokemonSpecies
  renameLabel.parentNode.parentNode.dataset.id = pokemonId
}

function createRenameForm(starter) {
  const form = document.createElement('form')
  if(starter){
    form.id = 'starter-form'
  }else{
    form.id = 'rename-form'
  }
  form.classList = 'close'
  form.innerHTML = `
    <div class="form-group">
      <label id="rename-label" for="name"></label>
      <input type="name" class="form-control" id="name" >
    </div>
    <button type="submit" class="btn btn-primary btn-md" value="Submit">Submit</button>
    `
  centerColumn.insertBefore(form, centerColumn.lastElementChild)
}

function chooseStartingPokemon() {
  centerColumn.innerHTML = `
    <div class="container">
      <img class="pokemon-sprites" data-species="Pikachu" data-id="25" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png">
      <img class="pokemon-sprites" data-species="Bulbasaur" data-id="1" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png">
    </div>
    <div class="container">
      <img class="pokemon-sprites" data-species="Charmander" data-id="4" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png">
      <img class="pokemon-sprites" data-species="Squirtle" data-id="7" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png">
    </div>
    <p id="message">Please select your starting Pokemon!</p>
    `
  createRenameForm('starter')
}



function newPlayerStart() {
  const locationP = leftColumn.querySelector('#location-p')
  locationP.innerText = 'Pallet Town Center' // set last location name
  locationP.dataset.location = 13 // set last locaiton id
  centerColumn.innerHTML = `
    <img id="location-img" src="./images/locations/img_13.png">
    <p id="message">Welcome to Pallet Town! Use your arrow keys to move around. You can search for Pokémon to collect, but first you need to find some Poké Balls! Professor Oak has given you one to start with. He also said it's dangerous out there, so take an HP-UP as well!</p>
    `

  const pokeBallLi = document.createElement('li')
  const hpUpLi = document.createElement('li')

  // get user hp, item, and pokemon count/names
  leftColumn.querySelector('#hp-p').innerText = 100

  getItem("master-ball", 1);
  getItem("potion", 1);


}

function addPokemon(pokemon, pokeId) {
  // if(leftColumn.querySelector('#').innerText.slice(1) == 0){return}
  const pokeLi = document.createElement('li')
  pokeLi.innerHTML = `${capitalize(pokemon.name)} | ${capitalize(pokemon.species)} <img src="${pokemon.img_url}"/>`
  pokeLi.dataset.species = pokemon.species
  pokeLi.dataset.id = pokeId
  leftColumn.querySelector('#pokemon-ul').append(pokeLi)  
}

function removePokeBall(pokemonSpecies) {  
  const currentAmount = leftColumn.querySelector('#pokeball-amount').innerText.slice(1)
  if(currentAmount == 0){
    centerColumn.querySelector('#message').innerText = `Try getting more Poké Balls first! And ${pokemonSpecies} ran away!`
    return
  }
  centerColumn.querySelector('#message').innerText = `You successfully caught ${pokemonSpecies}!`
  // update inventory in database
  leftColumn.querySelector('#pokeball-amount').innerText = 'x' + (parseInt(currentAmount) - 1)
}

function showCurrentLocation() {

  const locationId = leftColumn.querySelector('#location-p').dataset.location
  const locationImg = centerColumn.querySelector('#location-img')
  locationImg.removeAttribute("data-id")
  locationImg.removeAttribute("data-name")
  locationImg.src = `./images/locations/img_${locationId}.png`
}

function removeHpUp() {
  const hpupAmount = leftColumn.querySelector('#hpup-amount').innerText.slice(1)
  const currentHP = parseInt(leftColumn.querySelector('#hp-p').innerText)
  if(hpupAmount == 0){
    centerColumn.querySelector('#message').innerText = `Try getting more HP-UP first!`
  }else if(currentHP == 100){
    centerColumn.querySelector('#message').innerText = `You're already at full health!`
  }else{
    centerColumn.querySelector('#message').innerText = `You successfully healed 20 HP!`
    // update HP in database
    leftColumn.querySelector('#hpup-amount').innerText = 'x' + (parseInt(hpupAmount) - 1)
    addHeal(currentHP)
  }
}

function addHeal(currentHP) {
  if(currentHP + 20 > 100){
    leftColumn.querySelector('#hp-p').innerText = 100
  }else{
    leftColumn.querySelector('#hp-p').innerText = currentHP + 20
  }
}

function moveLocation(direction) {
  // move around the grid
  const locationP = leftColumn.querySelector('#location-p')  

  const valid = validMove(locationP.dataset.location, direction)
  if(valid == false){
    failedMessage('That is not a valid move, try another direction!')
    return
  }else if(valid == 'victory'){
    failedMessage("You're not ready to head down Victroy Road!")
    return
  }else if(valid == 'north'){
    failedMessage("You're not allowed in that city!")
    return
  }

  let num = 0
  if(direction == 'Left'){
    num = -1
  }else if(direction == 'Right'){
    num = 1
  }else if(direction == 'Up'){
    num = -5
  }else if(direction == 'Down'){
    num = 5
  }  

  locationP.dataset.location = parseInt(locationP.dataset.location) + num
  centerColumn.querySelector('#location-img').src = `./images/locations/img_${locationP.dataset.location}.png`

  encounterCheck()
}

function failedMessage(message) {
  centerColumn.querySelector('#message').innerText = message
}

function encounterCheck() {
  const num = Math.floor(Math.random()*100)+1
  if(num < 20){
    fetchPokemon()
    return
  }else if(num > 80){
    foundItem()
    return
  }
  centerColumn.querySelector('#message').innerText = "You didn't find anything of use here. Try exploring more!"
}

function foundItem() {
  const num = Math.floor(Math.random()*2)+1
  if(num == 1){
    centerColumn.querySelector('#message').innerText = "You found a Poké Ball! Let's add it to your inventory!"
    const currentAmount = leftColumn.querySelector('#pokeball-amount').innerText.slice(1)
    // update inventory in database
    leftColumn.querySelector('#pokeball-amount').innerText = 'x' + (parseInt(currentAmount) + 1)
  }else{
    centerColumn.querySelector('#message').innerText = "You found a HP-UP! Let's add it to your inventory!"
    const currentAmount = leftColumn.querySelector('#hpup-amount').innerText.slice(1)
    // update inventory in database
    leftColumn.querySelector('#hpup-amount').innerText = 'x' + (parseInt(currentAmount) + 1)
  }
}

function fetchPokemon() {
  const num = Math.floor(Math.random()*151)+1  
  fetch(`https://pokeapi.co/api/v2/pokemon/${num}`)
    .then(resp => resp.json())
    .then(data => pokemonEncounter(data))
}

function pokemonEncounter(pokemon) {
  const capitalName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  centerColumn.querySelector('#message').innerText = `You found ${capitalName}! Click on it to try and capture it, or run away!`

  const locationImg = centerColumn.querySelector('#location-img')
  locationImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
  locationImg.dataset.id = pokemon.id
  locationImg.dataset.species = capitalName

  createRenameForm()
}

function validMove(currentLocation, direction) {
  switch(currentLocation) {
    case '1':
      if(direction == 'Right' || direction == 'Down'){return true}else{return false}
    case '2':
      if(direction == 'Right' || direction == 'Down' || direction == 'Left'){return true}else{return false}
    case '3':
      if(direction == 'Down'){return true}else{return false}
    case '4':
      if(direction == 'Down'){return true}else{return false}
    case '5':
      if(direction == 'Down'){return true}else{return 'north'}
    case '6':
      if(direction == 'Right' || direction == 'Down' || direction == 'Up'){return true}else{return false}
    case '7':
      if(direction == 'Up' || direction == 'Down' || direction == 'Left'){return true}else{return false}
    case '8':
      if(direction == 'Down' || direction == 'Up'){return true}else{return false}
    case '9':
      if(direction == 'Right' || direction == 'Down' || direction == 'Up'){return true}else{return false}
    case '10':
      if(direction == 'Left' || direction == 'Down' || direction == 'Up'){return true}else{return false}
    case '11':
      if(direction == 'Right' || direction == 'Up'){return true}else{return false}
    case '12':
        return true
    case '13':
        return true
    case '14':
        return true
    case '15':
      if(direction == 'Left' || direction == 'Down' || direction == 'Up'){return true}else{return 'victory'}
    case '16':
      if(direction == 'Right'){return true}else{return false}
    case '17':
      if(direction == 'Right' || direction == 'Up' || direction == 'Left'){return true}else{return false}
    case '18':
        return true
    case '19':
      if(direction == 'Right' || direction == 'Up' || direction == 'Left'){return true}else{return false}
    case '20':
      if(direction == 'Up' || direction == 'Down' || direction == 'Left'){return true}else{return false}
    case '21':
      if(direction == 'Right'){return true}else{return false}
    case '22':
      if(direction == 'Right' || direction == 'Left'){return true}else{return false}
    case '23':
      if(direction == 'Right' || direction == 'Left' || direction == 'Up'){return true}else{return false}
    case '24':
      if(direction == 'Left' || direction == 'Right'){return true}else{return false}
    case '25':
      if(direction == 'Left' || direction == 'Up'){return true}else{return false}
    default:
      return true
  }
}

getUsers();
