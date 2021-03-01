import { createStore } from 'vuex'

import audio from './modules/audio'

const store = createStore({
	modules: {
		audio
	}
})

export default store