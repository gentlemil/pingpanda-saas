import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import { TimeRange } from '@/app/lib/types/category.types'
import { format } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
)

interface LineGrapghProps {
  activeTab: TimeRange
  data: any
}

export const LineGraph = ({ activeTab, data }: LineGrapghProps) => {
  if (!data) {
    return <div>empty state</div>
  }

  const labels = Object.keys(data).map((el) =>
    activeTab === 'today'
      ? format(new Date(el), 'HH:mm')
      : activeTab === 'week'
      ? format(new Date(el), 'EEEE')
      : format(new Date(el), 'dd')
  )

  const options: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: false,
        text: 'This is a graph representing event calling',
      },
    },
  }

  const lineChartData = {
    labels,
    datasets: [
      {
        label: 'statistics',
        data: [...Object.values(data)],
        borderColor: '#4B76C9',
      },
    ],
  }

  return (
    <div className=''>
      <Line options={options} data={lineChartData} />
    </div>
  )
}
