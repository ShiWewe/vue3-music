export default {
	mounted (el, binding, vnode) {
		const copyHanle = () => {
			let text = el.nextElementSibling.innerText
			let textarea = document.createElement('textarea')
			textarea.style.readonly = 'readonly';
			textarea.style.position = 'absolute';
			textarea.style.left = '-9999px';
			textarea.value = text
			document.body.appendChild(textarea)
			textarea.select()
			let result = document.execCommand('Copy')
			console.log(result)
			if (result) {
				document.body.removeChild(textarea)
			}
		}
		el.addEventListener('click', copyHanle, false)
	},
	unmounted (el) {
		el.removeEventListener('click', null)
	}
}