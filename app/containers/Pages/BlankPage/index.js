import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Helmet } from 'react-helmet'
import brand from 'dan-api/dummy/brand'
import { PapperBlock, LocationMap } from 'dan-components'
import Funnel, {
  Title,
  Margin,
  Export,
  Item,
  Border,
  Label,
} from 'devextreme-react/funnel'
import { usePropertieContext } from '../../../components/Propertie/Context'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

function formatLabel(arg) {
  return `<span class="label">${arg.valueText}</span><br/>${arg.item.argument}`
}

function BlankPage() {
  const title = brand.name + ' - Dashboard'
  const description = brand.desc
  const { userId } = usePropertieContext()

  const [customers, setCustomers] = useState()
  const [regions, setRegions] = useState([])

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

    axios
      .get('/api/properties', { params: { user_id: userId } })
      .then((result) => {
        const data = result.data.map((propertie) => {
          return { ...propertie.location, name: propertie.title }
        })

        setRegions(data)
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
      <PapperBlock title='Relatórios' desc='' whiteBg icon='ion-ios-podium'>
        <Grid container spacing={2}>
          <Grid item sm={3} xs={12}>
            <Paper style={{ padding: 10 }}>
              <Funnel
                id='funnel'
                dataSource={customers}
                palette='Material'
                argumentField='argument'
                valueField='value'
                sortData={false}
              >
                <Title text='Conversão de clientes'>
                  <Margin bottom={30} />
                </Title>
                <Export enabled={false} />
                {/* <Tooltip enabled={true} format='fixedPoint' /> */}
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
            </Paper>
          </Grid>
          <Grid item sm={9} xs={12}>
            <Paper style={{ padding: 10 }}>
              <Typography
                align='center'
                variant='subtitle1'
                style={{
                  fontSize: 28,
                  marginBottom: 22.2,
                  color: 'rgb(35, 35, 35)',
                  fontFamily:
                    '"Segoe UI Light", "Helvetica Neue Light", "Segoe UI", "Helvetica Neue", "Trebuchet MS", Verdana, sans-serif',
                }}
              >
                Regiões dos imóveis
              </Typography>

              <LocationMap viewRegions={true} regions={regions} />
            </Paper>
          </Grid>
          <Grid item sm={12} xs={12}>
            <Paper style={{ padding: 10 }}>
              <Funnel
                id='funnel'
                dataSource={customers}
                palette='Material'
                argumentField='argument'
                valueField='value'
                sortData={false}
              >
                <Title text='Conversão de clientes'>
                  <Margin bottom={30} />
                </Title>
                <Export enabled={false} />
                {/* <Tooltip enabled={true} format='fixedPoint' /> */}
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
            </Paper>
          </Grid>
        </Grid>
      </PapperBlock>
    </div>
  )
}

export default BlankPage
