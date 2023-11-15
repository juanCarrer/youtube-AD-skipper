console.log('loading youtube Ad skipper')

const observer = new MutationObserver(handleMainParentElementChange);
const observerConfig = { attributes: true, childList: true, subtree: true }

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.type === 'changeUrl') {
      console.log('change url')
      main()
    }
    return true
  }
)

async function waitPageReady () {
  while (true) {
    const parentElement = document.querySelector('#container div.video-ads')
    if (parentElement) {
      console.log('page ready', parentElement)
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
  let buttonElement = null
  
  buttonElement = document.querySelector('#container div.video-ads button.ytp-ad-skip-button-modern')
  if (!buttonElement) {
    // si no encuentra el boton modern
    console.log('modern no encontrado')
    buttonElement = document.querySelector('#container div.video-ads button.ytp-ad-skip-button')
  }
  console.log('button Element', buttonElement)
  
  if (buttonElement) {
    buttonElement.click()
    console.log('ad skiped')
    return true
  }
  console.log('no ad')
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



// nuevo elemento <button class="ytp-ad-skip-button-modern ytp-button"><div class="ytp-ad-text ytp-ad-skip-button-text-centered ytp-ad-skip-button-text" id="ad-text:h" style="">Omitir</div><span class="ytp-ad-skip-button-icon-modern"><svg height="100%" viewBox="-6 -6 36 36" width="100%"><path d="M5,18l10-6L5,6V18L5,18z M19,6h-2v12h2V6z" fill="#fff"></path></svg></span></button>