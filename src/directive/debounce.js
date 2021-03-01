export default {
	mounted (el, { value }, vnode) {
		let t = value[0] || 1000
		let foo = value[1]

		let debounce = (fn) => {
			let timeOut = null
			return () => {
				clearTimeout(timeOut)
				timeOut = setTimeout(() => {
					fn.call(this)
				}, t)
			}
		}

		el.addEventListener('click', debounce(foo), true)

	},
	unmounted (el) {
		el.removeEventListener('click', null)
	}
}
