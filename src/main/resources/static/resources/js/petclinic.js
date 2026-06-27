console.log('petclinic.js')

window.ajtContentHandlers = Object.assign({
  dialog(element, handleRemoveContent, handleAddContent) {
    const dialog = document.createElement('dialog')
    dialog.closedBy = 'any'
    dialog.append(element)
    handleAddContent(dialog)
    return () => {
      document.body.append(dialog)
      dialog.showModal()
    }
  }
}, window.ajtContentHandlers)

window.ajtCompare = function (a, b) {
  if (!a.isEqualNode(b)) {
    if (a.dataset.ajtCompare || b.dataset.ajtCompare) {
      return a.dataset.ajtCompare === b.dataset.ajtCompare
    }
    if (a.id || b.id) {
      return a.id === b.id
    }
    const containsSameId = Array.from(a.querySelectorAll('[id]')).some(elA => {
      if (!elA.id) {
        return false
      }
      const elB = document.getElementById(elA.id)
      if (!elB) {
        return false
      }
      return elA.nodeName === elB.nodeName
    })
    const containsSameInput = Array.from(a.querySelectorAll('input[name]')).some(inputA => {
      const inputB = b.querySelector(`input[${inputA.name}]`)
      const same = inputB === null
        ? false
        : inputA.type === inputB.type
      return same
    })
    return containsSameInput
  }
  return true
}
