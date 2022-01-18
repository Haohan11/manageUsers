
//   const root = document.documentElement
  
//   const buttons = document.querySelectorAll("button")
  
//   Array.from(buttons, button => {
//     button.addEventListener("mousemove", e => {
//       root.style.setProperty("--mouse-position", `${e.offsetX}px`)
//       // console.log(e.offsetX)
//     })
//   })
const section = (...elements) => {
    
}

const selectSection = document.querySelector(".select-section")
const [getSection, postSection, putSection, deleteSection] =
      document.querySelectorAll(".action-section")
const actionSections = {get: getSection, post: postSection,
       put: putSection, delete: deleteSection}
const actionButtons = selectSection.querySelectorAll("button")

Array.from(actionButtons, button => {
  button.addEventListener("click", (event) => {
    handleDisplay(selectSection, "none")
    handleDisplay(actionSections[event.target.name], "flex")
  })
})

Object.keys(actionSections).map( (key) => {
  const backButton = actionSections[key].querySelector(".backButton")
  backButton.addEventListener("click", () => {      
    handleDisplay(actionSections[key], "none")
    handleDisplay(selectSection, "flex")
    if(key !== "post") resetID()
  })
})

const handleDisplay = (element, property) => {
  element.style.display = property
}

let ID = 0
const [...idInputs] = document.querySelectorAll(".idInput")
idInputs.map( idInput => {
  idInput.addEventListener("change", e => {
    let id = Math.round(e.target.value)
    id = id <= 0 ? null : id
    e.target.value = id
    ID = id
  })
})

const resetID = () => {
  idInputs.map( idInput => {
    if(!idInput.value) return
    idInput.value = null
    ID = 0
  })
}

const getAUserButton = getSection.querySelector("#getAUser")
getAUserButton.addEventListener("click", () => {
  if(ID) getUser(ID)
})

const getAllUsersButton = getSection.querySelector("#getAllUsers")
getAllUsersButton.addEventListener("click", () => {
  getUser()
})
      

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

const getUser = async id => {
  let url = BASE_URL
  if(id) url = `${url}/${id}`
  showMessage("Loading...")
  try {
    const response = await fetch(url)
    const data = await response.json()
    outputInformation(data)
    // console.log(data)
  } catch (error) {
    // console.log(error)
  }
}

const infoBlock = document.querySelector("#info-block")
const outputInformation = (information) => {
  if(typeof information[0] === "object") {
    showMessage(typeof information[1])
    return
  }
  if(!information["id"]) {
    // showMessage("User doesn't exist")
    return
  }
  infoBlock.innerHTML = `
    <div><h3>User id:</h3><p>${information["id"]}</p></div>
    <div><h3>Title:</h3><p>${information["title"]}</p></div>
    <div><h3>Body:</h3><p>${information["body"]}</p></div>
  `
}

const showMessage = (message) => {
  infoBlock.innerHTML = `<span>${message}</span>`
}
