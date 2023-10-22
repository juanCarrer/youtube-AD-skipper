const observer = new MutationObserver(handleMainParentElementChange);
const observerConfig = { attributes: true, childList: true, subtree: true }

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.type === 'changeUrl') {
      main()
    }
    return true
  }
)

async function waitPageReady () {
  while (true) {
    const parentElement = document.querySelector('#container div.video-ads')
    if (parentElement) {
      return parentElement
    }
    await sleep(500)
  }
}

function handleMainParentElementChange (mutationList, observer) {
  clickSkipButton()
}

async function main () {
  observer.disconnect()
  if (!window.location.pathname.includes('watch')) {
    return
  }
  const mainParentElement = await waitPageReady() // espera a que el elemento padre exista
  
  clickSkipButton() // para la primera carga
  
  observer.observe(mainParentElement, observerConfig) // detecta cambios posteriores
}

function clickSkipButton () {
  const buttonElement = document.querySelector('#container div.video-ads button.ytp-ad-skip-button')

  if (buttonElement) {
    buttonElement.click()
    console.log('add skiped')
    return true
  }
  return false
}

// espera una cantidad de milisegundos
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

main()

// primer acercamiento ( funciona pero tiene mal rendimiento) 
// setInterval(() => {
//   const skipAddButton = document.querySelector('button.ytp-ad-skip-button')
//   if (skipAddButton) {
//     skipAddButton.click()
//   }
// }, 1000)