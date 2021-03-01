export default [
	{
		path: '/',
		redirect: '/Discovery'
	},
	{
		path: '/Discovery',
		name: 'Discovery',
		component: () => import('../views/Discovery.vue')
	},
	{
		path: '/Mvs',
		name: 'Mvs',
		component: () => import('../views/Mvs.vue')
	},
	{
		path: '/MvsDetail/:id',
		name: 'MvsDetail',
		component: () => import('../views/mvs/MvsDetail.vue')
	},
	{
		path: '/Playlists',
		name: 'Playlists',
		component: () => import('../views/Playlists.vue')
	},
	{
		path: '/Playlist/:id',
		name: 'Playlist',
		component: () => import('../views/playlists/Playlist.vue')
	},
	{
		path: '/Songs',
		name: 'Songs',
		component: () => import('../views/Songs.vue')
	},
	{
		path: '/Result',
		name: 'Result',
		component: () => import('../views/Result.vue')
	}
]