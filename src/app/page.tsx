"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChartContainer } from "@/components/ui/chart"
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface DataPoint {
  year: number;
  coal: number;
  naturalGas: number;
  nuclear: number;
  renewables: number;
  petroleum: number;
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

type CustomTooltipProps = TooltipProps<ValueType, NameType>;

const colorMap = {
  coal: '#333333',      // dark gray for coal
  naturalGas: '#4169E1', // royal blue for natural gas (changed from orange)
  nuclear: '#FF0000',    // red for nuclear (changed from royal blue)
  renewables: '#228B22', // forest green for renewables
  petroleum: '#8B4513'   // saddle brown for petroleum
};

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Electricity%20Generation%20Major%20Source-jPNbgGj5RdiFlV4x9rYX8d8EESsVU8.csv')
      .then(response => response.text())
      .then(csvData => {
        const rows = csvData.split('\n').slice(1);
        const processedData = rows.map(row => {
          const [year, coal, naturalGas, nuclear, renewables, petroleum] = row.split(',');
          return {
            year: parseInt(year),
            coal: parseFloat(coal),
            naturalGas: parseFloat(naturalGas),
            nuclear: parseFloat(nuclear),
            renewables: parseFloat(renewables),
            petroleum: parseFloat(petroleum)
          };
        }).filter(record => !isNaN(record.year));
        setData(processedData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleDownload = () => {
    if (chartRef.current) {
      const chartContainer = chartRef.current;
      const svg = chartContainer.querySelector('svg');
      if (svg) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          // Set canvas size to accommodate title, chart and legend
          canvas.width = img.width;
          canvas.height = img.height + 120; // Extra height for title and legend
          
          if (ctx) {
            // Fill white background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add title
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('U.S. Electricity Generation by Major Energy Source (1950-2023)', canvas.width / 2, 30);
            ctx.font = '14px Arial';
            ctx.fillText('Data shown in billion kilowatthours', canvas.width / 2, 50);
            
            // Draw chart image
            ctx.drawImage(img, 0, 80);
            
            // Add legend at the bottom
            const legendItems = [
              { label: 'Coal', color: colorMap.coal },
              { label: 'Natural Gas', color: colorMap.naturalGas },
              { label: 'Nuclear', color: colorMap.nuclear },
              { label: 'Renewables', color: colorMap.renewables },
              { label: 'Petroleum', color: colorMap.petroleum }
            ];
            
            // Draw legend
            ctx.textAlign = 'left';
            ctx.font = '12px Arial';
            let xOffset = canvas.width / 2 - 250; // Starting position
            const yPosition = canvas.height - 20;
            
            legendItems.forEach(item => {
              // Draw color box
              ctx.fillStyle = item.color;
              ctx.fillRect(xOffset, yPosition - 10, 15, 15);
              
              // Draw label
              ctx.fillStyle = '#000000';
              ctx.fillText(item.label, xOffset + 20, yPosition);
              
              xOffset += 80; // Fixed spacing between items
            });
          }
          
          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = 'electricity-generation-chart.png';
          downloadLink.href = pngFile;
          downloadLink.click();
        };
        const svgData = new XMLSerializer().serializeToString(svg);
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>U.S. Electricity Generation by Major Energy Source (1950-2023)</CardTitle>
          <CardDescription>Data shown in billion kilowatthours</CardDescription>
        </CardHeader>
        <CardContent>
          <div ref={chartRef}>
            <ChartContainer
              config={{
                coal: {
                  label: "Coal",
                  cssVariable: colorMap.coal,
                },
                naturalGas: {
                  label: "Natural Gas",
                  cssVariable: colorMap.naturalGas,
                },
                nuclear: {
                  label: "Nuclear",
                  cssVariable: colorMap.nuclear,
                },
                renewables: {
                  label: "Renewables",
                  cssVariable: colorMap.renewables,
                },
                petroleum: {
                  label: "Petroleum",
                  cssVariable: colorMap.petroleum,
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip
                    content={(props: CustomTooltipProps) => {
                      const { active, payload, label } = props;
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded p-2 shadow-md">
                            <p className="font-bold">{`Year: ${label}`}</p>
                            {payload.map((entry) => (
                              <p key={entry.name} style={{ color: entry.color }}>
                                {`${entry.name}: ${entry.value?.toFixed(2)} billion kWh`}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="coal" 
                    stroke={colorMap.coal}
                    name="Coal" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="naturalGas" 
                    stroke={colorMap.naturalGas}
                    name="Natural Gas" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="nuclear" 
                    stroke={colorMap.nuclear}
                    name="Nuclear" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="renewables" 
                    stroke={colorMap.renewables}
                    name="Renewables" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="petroleum" 
                    stroke={colorMap.petroleum}
                    name="Petroleum" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          {/* <div className="mt-4 flex justify-center">
            <Button onClick={handleDownload}>Download as PNG</Button>
          </div> */}
        </CardContent>
      </Card>
    </div>
  )
}
