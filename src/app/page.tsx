"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChartContainer } from "@/components/ui/chart"

interface DataPoint {
  year: number;
  coal: number;
  naturalGas: number;
  nuclear: number;
  renewables: number;
  petroleum: number;
}

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
      const svg = chartRef.current.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = 'electricity-generation-chart.png';
          downloadLink.href = pngFile;
          downloadLink.click();
        };
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
                  cssVariable: "--color-coal",
                },
                naturalGas: {
                  label: "Natural Gas",
                  cssVariable: "--color-naturalGas",
                },
                nuclear: {
                  label: "Nuclear",
                  cssVariable: "--color-nuclear",
                },
                renewables: {
                  label: "Renewables",
                  cssVariable: "--color-renewables",
                },
                petroleum: {
                  label: "Petroleum",
                  cssVariable: "--color-petroleum",
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
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded p-2 shadow-md">
                            <p className="font-bold">{`Year: ${label}`}</p>
                            {payload.map((entry: any, index: number) => (
                              <p key={`item-${index}`} style={{ color: entry.color }}>
                                {`${entry.name}: ${entry.value.toFixed(2)} billion kWh`}
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
                    stroke={`var(--color-coal)`} 
                    name="Coal" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="naturalGas" 
                    stroke={`var(--color-naturalGas)`} 
                    name="Natural Gas" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="nuclear" 
                    stroke={`var(--color-nuclear)`} 
                    name="Nuclear" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="renewables" 
                    stroke={`var(--color-renewables)`} 
                    name="Renewables" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="petroleum" 
                    stroke={`var(--color-petroleum)`} 
                    name="Petroleum" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="mt-4 flex justify-center">
            <Button onClick={handleDownload}>Download as PNG</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
