import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar, { type VueId } from './components/Sidebar'
import FactoryLine from './components/FactoryLine'
import ModuleLibrary from './components/ModuleLibrary'
import PlantConfigurator from './components/PlantConfigurator'
import LifecycleLoop from './components/LifecycleLoop'
import SimulationDashboard from './components/SimulationDashboard'
import DigitalPassport from './components/DigitalPassport'
import Disclaimer from './components/Disclaimer'
import { parametresParDefaut } from './simulation/engine'
import type { ParametresSimulation, UsineModulaire } from './simulation/types'

// Coquille de l'application, gere la navigation et l'etat global en memoire.
export default function App() {
  const [vue, setVue] = useState<VueId>('chaine')

  // Parametres de simulation partages, pilotes depuis le tableau de bord
  // et reutilises par la chaine de fabrication.
  const [params, setParams] = useState<ParametresSimulation>(parametresParDefaut)

  // Usine en cours de configuration, partagee avec le passeport.
  const [usine, setUsine] = useState<UsineModulaire | null>(null)

  // Module choisi pour le passeport numerique.
  const [moduleActifId, setModuleActifId] = useState<string | null>(null)

  const ouvrirPasseport = (id: string) => {
    setModuleActifId(id)
    setVue('passeport')
  }

  const contenu = useMemo(() => {
    switch (vue) {
      case 'chaine':
        return <FactoryLine params={params} />
      case 'bibliotheque':
        return <ModuleLibrary onPasseport={ouvrirPasseport} />
      case 'configurateur':
        return <PlantConfigurator usine={usine} setUsine={setUsine} />
      case 'cycle':
        return <LifecycleLoop reemploi={params.reemploi} />
      case 'simulation':
        return (
          <SimulationDashboard
            params={params}
            setParams={setParams}
            usine={usine}
          />
        )
      case 'passeport':
        return (
          <DigitalPassport
            moduleActifId={moduleActifId}
            setModuleActifId={setModuleActifId}
          />
        )
    }
  }, [vue, params, usine, moduleActifId])

  return (
    <div className="flex h-full min-h-screen flex-col bg-fond md:flex-row">
      <Sidebar vue={vue} setVue={setVue} />

      <main className="relative flex min-w-0 flex-1 flex-col">
        <Disclaimer />

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={vue}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {contenu}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
