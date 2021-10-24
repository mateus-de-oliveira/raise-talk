import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Helmet } from 'react-helmet'
import brand from 'dan-api/dummy/brand'
import { PapperBlock } from 'dan-components'
import Funnel, {
  Title,
  Margin,
  Export,
  Tooltip,
  Item,
  Border,
  Label,
  AdaptiveLayout,
  Legend,
} from 'devextreme-react/funnel'
import { usePropertieContext } from '../../../components/Propertie/Context'

function formatLabel(arg) {
  return `<span class="label">${arg.valueText}</span><br/>${arg.item.argument}`
}

function BlankPage() {
  const title = brand.name + ' - Dashboard'
  const description = brand.desc
  const { userId } = usePropertieContext()

  const [customers, setCustomers] = useState()

  useEffect(() => {
    axios
      .get('/api/customers', { params: { user_id: userId } })
      .then((resultado) => {
        const data = resultado.data.map((item) => {
          if (item.status == 101)
            return { argument: 'Lead', color: '#e67e22', value: 0 }
          if (item.status == 102)
            return { argument: 'Atendimento', color: '#6412BC', value: 0 }
          if (item.status == 103)
            return { argument: 'Agendamento', color: '#3498db', value: 0 }
          if (item.status == 104)
            return { argument: 'Visita', color: '#9b59b6', value: 0 }
          if (item.status == 105)
            return { argument: 'Proposta', color: '#e74c3c', value: 0 }
          if (item.status == 106)
            return { argument: 'Fechamento', color: '#2ecc71', value: 0 }
        })

        const result = [
          ...data
            .reduce((mp, o) => {
              if (!mp.has(o.argument)) mp.set(o.argument, { ...o, value: 0 })
              mp.get(o.argument).value++
              return mp
            }, new Map())
            .values(),
        ]

        let sortOrder = [
          'Lead',
          'Atendimento',
          'Agendamento',
          'Visita',
          'Proposta',
          'Fechamento',
        ]

        result.sort(function(a, b) {
          return sortOrder.indexOf(a.argument) - sortOrder.indexOf(b.argument)
        })

        setCustomers(result)
      })
  }, [])

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
      <PapperBlock title='Dashboard' desc='Some text description'>
        <Funnel
          id='funnel'
          dataSource={customers}
          palette='Material'
          argumentField='argument'
          valueField='value'
          sortData={false}
        >
          <Legend visible={true} />

          <Title text='Conversão de clientes'>
            <Margin bottom={30} />
          </Title>
          <Export enabled={true} />
          <Tooltip enabled={true} format='fixedPoint' />
          <Item>
            <Border visible={false} />
          </Item>
          <Label
            visible={true}
            position='inside'
            backgroundColor='none'
            customizeText={formatLabel}
          />
        </Funnel>
      </PapperBlock>
    </div>
  )
}

export default BlankPage
