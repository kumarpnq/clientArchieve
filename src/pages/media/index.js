import { Fragment } from 'react'
import DataCard from 'src/views/media/DataCard'
import Stepper from 'src/views/media/Stepper'

const MediaAnalysis = () => {
  return (
    <Fragment>
      {/* stepper */}
      <Stepper />
      <DataCard />
    </Fragment>
  )
}

export default MediaAnalysis
