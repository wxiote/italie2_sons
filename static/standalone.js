import { createApp, ref, onMounted, onBeforeUnmount } from 'https://unpkg.com/vue@3.3.4/dist/vue.esm-browser.js'

// Read token from injected config (window.__MAPBOX_TOKEN__), URL query or localStorage (in that order)
const initialToken = (window.__MAPBOX_TOKEN__ || new URLSearchParams(location.search).get('token') || localStorage.getItem('mapbox_token') || '')

const App = {
  template: `
    <div class="app-root">
      <aside id="controls">
        <h1>Italie — 2 cartes (Standalone)</h1>
        <p>Exemple sans Vite — colle ton token Mapbox dans l'URL (<code>?token=TON_TOKEN</code>) ou saisis-le ci-dessous.</p>

        <div v-if="!token" class="token-box">
          <label for="token">Token Mapbox (pk.*) :</label>
          <input id="token" v-model="tokenInput" placeholder="pk. ..." />
          <div style="margin-top:8px">
            <button @click="applyToken">Utiliser ce token</button>
            <button @click="saveLocal" v-if="tokenInput" style="margin-left:8px">Enregistrer localement</button>
          </div>
          <small style="display:block;margin-top:8px;color:#666">Conseil : utilise un token public (pk.*). Ne commite pas de token privé.</small>
        </div>

        <div v-if="error" class="error" v-html="error"></div>
      </aside>
      <section class="maps">
        <div class="two-maps-root">
          <div ref="left" class="map-half" id="map-left"></div>
          <div ref="right" class="map-half" id="map-right"></div>
        </div>
      </section>
    </div>
  `,
  setup() {
    const left = ref(null)
    const right = ref(null)
    const error = ref('')

    const token = ref(initialToken)
    const tokenInput = ref('')

    let maps = []

    function createMaps(t) {
      if (!t) return
      if (!window.mapboxgl) {
        error.value = 'Erreur : mapboxgl non trouvé. Vérifie que le script Mapbox est chargé.'
        return
      }

      try {
        const mapboxgl = window.mapboxgl
        mapboxgl.accessToken = t

        const mapLeft = new mapboxgl.Map({
          container: left.value,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [12.4964, 41.9028],
          zoom: 5
        })

        const mapRight = new mapboxgl.Map({
          container: right.value,
          style: 'mapbox://styles/mapbox/satellite-streets-v12',
          center: [9.1900, 45.4642],
          zoom: 5
        })

        mapLeft.addControl(new mapboxgl.NavigationControl())
        mapRight.addControl(new mapboxgl.NavigationControl())

        maps.push(mapLeft, mapRight)
      } catch (err) {
        error.value = 'Erreur lors de l\'initialisation des cartes: ' + (err.message || err)
        console.error(err)
      }
    }

    onMounted(() => {
      if (!token.value) {
        // show a hint and let user enter token using the UI
        error.value = '⚠️ Aucune clé Mapbox fournie. Saisis-la dans le panneau de gauche ou passe-la via `?token=` dans l\'URL.'
        return
      }

      createMaps(token.value)
    })

    function applyToken() {
      if (!tokenInput.value) return
      token.value = tokenInput.value.trim()
      // reflect in URL for convenience
      try { history.replaceState(null, '', location.pathname + '?token=' + encodeURIComponent(token.value)) } catch (e) {}
      error.value = ''
      createMaps(token.value)
    }

    function saveLocal() {
      if (!tokenInput.value) return
      localStorage.setItem('mapbox_token', tokenInput.value.trim())
      applyToken()
    }

    onBeforeUnmount(() => {
      maps.forEach(m => m.remove())
    })

    return { left, right, error, token, tokenInput, applyToken, saveLocal }
  }
}

createApp(App).mount('#app')
