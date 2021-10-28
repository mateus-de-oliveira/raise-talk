import React from 'react'
import { Helmet } from 'react-helmet'
import brand from 'dan-api/dummy/brand'
import { PapperBlock, EmptyData, Propertie } from 'dan-components'

function BasicTable() {
  const title = brand.name + ' - Table'
  const description = brand.desc
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='twitter:title' content={title} />
        <meta property='twitter:description' content={description} />
      </Helmet>
      <PapperBlock title='Tabela de imóveis' whiteBg icon='ion-md-home' desc=''>
        <div>
          <Propertie />
          {/* <StrippedTable /> */}
        </div>
      </PapperBlock>
    </div>
  )
}

export default BasicTable
