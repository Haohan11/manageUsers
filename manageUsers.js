
let Id = 0
const inputTexts = {}
const selectSection = document.querySelector(".select-section")
const [...actionSections] = document.querySelectorAll(".action-section")

const Section = initSectionClass()

//create and get all section object
const sectionObjects = getSectionObjects(actionSections)

//add feature to section object
sectionObjects.map(sectionObject => {
    
    settingActionButtons(sectionObject)

    settingBackButtons(sectionObject)

    sectionObject.idInput ? settingIdInputs(sectionObject) : delete sectionObject.idInput

    sectionObject.textInputs.length ? settingTextInputs(sectionObject) : delete sectionObject.textInputs

    settingSubmitButtons(sectionObject)
})

function initSectionClass() {
    const Section = function (action, element) {
        this.action = action
        this.element = element
    }
    
    Section.prototype.show = function() {
        showDisplay(this.element)
    }
    
    Section.prototype.hide = function() {
        hideDisplay(this.element)
    }
    
    Section.prototype.resetIdInput = function() {
        if(this.idInput) this.idInput.value = null
    }
    
    Section.prototype.resetTextInputs = function() {
        this.textInputs?.map( textInput => {
            textInput.value = null
        })
    }
    
    Section.prototype.getElements = function() {
        this.actionButton = selectSection.querySelector(`.${this.action}`)
        this.idInput = this.element.querySelector(".idInput")
        this.submitButtons = this.element.querySelectorAll(".submitButton")
        this.backButton = this.element.querySelector(".backButton")
        this.textInputs = this.element.querySelectorAll("input[type='text']")
    }
    
    Section.prototype.checkId = function() {
        if(!this.idInput) return true
        if(this.currentAction === "getAll") return true
        return Id ? true : false
    }
    
    Section.prototype.setClickTarget = function(index) {
        if(this.action !== "get") return
        this.currentAction = index ? "getAll" : "get"
    }
    
    Section.prototype.setId = function() {
        Id = this.idInput?.value
    }
    
    Section.prototype.handleSubmit = async function() {
    
        this.setId()
        if(!this.checkId()) return showMessage("Invalid ID")
    
        this.setInputTexts?.()
    
        const action = this.currentAction ?? this.action
        const url = getURL(action)
        const initObject = getInitObject(action)
    
        //start to fetch the resource
        showMessage("Loading...")
        const userInfo = await fetchResource(url, initObject)
        typeof userInfo === 'string' ? showMessage(userInfo) : showInformation(userInfo)
    }
    
    return Section
}

function getSectionObjects(actionSections) {
    const sectionObjects = actionSections.map(actionSection => {
        const action = actionSection.id.slice(0, actionSection.id.indexOf("-"))
        return createSection(action, actionSection)
    })
    return sectionObjects
}

function createSection(action, element) {
    const section = new Section(action, element)
    section.getElements()
    return section
}

function settingActionButtons(sectionObject) {
    sectionObject.actionButton.addEventListener("click", () => {
        hideDisplay(selectSection)
        sectionObject.show()
    })
}

function settingBackButtons(sectionObject) {
    sectionObject.backButton.addEventListener("click", () => {
        sectionObject.hide()
        showDisplay(selectSection)
        sectionObject.resetIdInput()
        sectionObject.resetTextInputs()
    })
}

function settingIdInputs(sectionObject) {
    sectionObject.idInput.addEventListener("change", event => {
        let id = Math.round(event.target.value)
        event.target.value = id > 0 ? id : null
    })
}

function settingSubmitButtons(sectionObject) {
    const [...submitButtons] = sectionObject.submitButtons
    sectionObject.submitButtons = submitButtons.map( submitButton => {
        const index = submitButtons.indexOf(submitButton)
        submitButton.addEventListener("click", () => {
            sectionObject.setClickTarget(index)
            sectionObject.handleSubmit()
        })
        return submitButton
    })
}

function settingTextInputs(sectionObject) {
    const [...textInputs] = sectionObject.textInputs
    sectionObject.textInputs = textInputs
    const textInputPair = textInputs.map( textInput => {
        const text = textInput.parentNode.innerText
        const key = text.slice(0, text.indexOf(':')).toLowerCase()
        inputTexts[key] = ''
        return {key: key, textInput: textInput}
    })

    sectionObject.setInputTexts = () => {
        textInputPair.map( pair => {
            inputTexts[pair['key']] = pair['textInput'].value
        })
    }
}

const showDisplay = element => {
    element.style.display = "flex"
}

const hideDisplay = element => {
    element.style.display = "none"
}

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

const getURL = action => {
    let url = BASE_URL
    return (action !== "getAll" && action !== "post") ? `${url}/${Id}` : url
}

const getInitObject = action => {
    if(action.includes("get")) return
    let method = action.toUpperCase()
    const initObject = {
        method: method,
        body: JSON.stringify(inputTexts),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    }
    return initObject
}

async function fetchResource(url, initObj) {
    try {
        const response = initObj ? await fetch(url, initObj) : await fetch(url)
        return response.ok ? await response.json() : "User doesn't exist"
    } catch (error) {}
}

const outputSection = document.querySelector("#output-section")
const showInformation = (information) => {
    const isArray = Array.isArray(information)
    if(!information["id"] && !isArray) return showMessage("User deleted")
    createInfoBlock(isArray ? information.length : 1)
    if(!isArray){
        const infoBlock = outputSection.querySelector(".info-block")
        infoBlock.querySelector(".userId").innerText = information["id"]
        infoBlock.querySelector(".title").innerText = information["title"]
        infoBlock.querySelector(".body").textContent = information["body"]
        return
    }
    const [...infoBlocks] = outputSection.querySelectorAll(".info-block")
    let i = 0
    infoBlocks.map( infoBlock => {
        infoBlock.querySelector(".userId").innerText = information[i]["id"]
        infoBlock.querySelector(".title").innerText = information[i]["title"]
        infoBlock.querySelector(".body").textContent = information[i]["body"]
        infoBlock.classList.add("show-border")
        i ++
    })
}

const showMessage = (message) => {
    outputSection.innerText = message
}

function createInfoBlock(amount) {
    let htmlText = ''
    for(let i = 0; i < amount; i ++){
        htmlText += `
        <div class="info-block">
            <div><h3>User id:</h3><p class="userId"></p></div>
            <div><h3>Title:</h3><p class="title"></p></div>
            <div><h3>Body:</h3><p class="body"></p></div>
        </div>
        `
    }
    outputSection.innerHTML = htmlText
}
