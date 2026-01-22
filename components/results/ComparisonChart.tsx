'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
  ReferenceLine,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { CashFlowData, RiskReturnData } from '@/lib/types';

interface CashFlowChartProps {
  data: CashFlowData[];
  recommendedScenario: 'A' | 'B' | 'C';
}

export function CashFlowChart({ data, recommendedScenario }: CashFlowChartProps) {
  const formatValue = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `£${(value / 1000000).toFixed(1)}m`;
    }
    return `£${(value / 1000).toFixed(0)}k`;
  };

  const getLineColor = (scenario: 'A' | 'B' | 'C') => {
    if (scenario === recommendedScenario) return '#D4A853';
    return '#94A3B8';
  };

  return (
    <Card variant="bordered" padding="lg">
      <h3 className="text-lg font-semibold text-text-primary mb-6">
        Cumulative Cash Flow Comparison
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} />
            <XAxis
              dataKey="year"
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
              label={{ value: 'Year', position: 'insideBottom', offset: -5, fill: '#94A3B8' }}
            />
            <YAxis
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={formatValue}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#F8FAFC' }}
              formatter={(value) => [formatValue(value as number), '']}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span style={{ color: '#94A3B8' }}>{value}</span>
              )}
            />
            <ReferenceLine y={0} stroke="#334155" />
            <Line
              type="monotone"
              dataKey="scenarioA"
              name="Scenario A"
              stroke={getLineColor('A')}
              strokeWidth={recommendedScenario === 'A' ? 3 : 2}
              dot={{ fill: getLineColor('A'), r: recommendedScenario === 'A' ? 4 : 3 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="scenarioB"
              name="Scenario B"
              stroke={getLineColor('B')}
              strokeWidth={recommendedScenario === 'B' ? 3 : 2}
              dot={{ fill: getLineColor('B'), r: recommendedScenario === 'B' ? 4 : 3 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="scenarioC"
              name="Scenario C"
              stroke={getLineColor('C')}
              strokeWidth={recommendedScenario === 'C' ? 3 : 2}
              dot={{ fill: getLineColor('C'), r: recommendedScenario === 'C' ? 4 : 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

interface RiskReturnChartProps {
  data: RiskReturnData[];
  recommendedScenario: 'A' | 'B' | 'C';
}

export function RiskReturnChart({ data, recommendedScenario }: RiskReturnChartProps) {
  const getColor = (scenario: string) => {
    if (scenario === recommendedScenario) return '#D4A853';
    return '#64748B';
  };

  return (
    <Card variant="bordered" padding="lg">
      <h3 className="text-lg font-semibold text-text-primary mb-6">
        Risk vs Return Analysis
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} />
            <XAxis
              type="number"
              dataKey="risk"
              name="Risk Score"
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
              domain={[0, 10]}
              label={{ value: 'Risk Score', position: 'insideBottom', offset: -5, fill: '#94A3B8' }}
            />
            <YAxis
              type="number"
              dataKey="irr"
              name="IRR"
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
              domain={[0, 'auto']}
              tickFormatter={(value) => `${value}%`}
              label={{ value: 'IRR (%)', angle: -90, position: 'insideLeft', fill: '#94A3B8' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#F8FAFC' }}
              formatter={(value, name) => [
                name === 'IRR' ? `${(value as number).toFixed(1)}%` : value,
                name as string,
              ]}
            />
            <Scatter name="Scenarios" data={data}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry.scenario)}
                  r={entry.scenario === recommendedScenario ? 12 : 8}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-4">
        {data.map((entry) => (
          <div key={entry.scenario} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: getColor(entry.scenario) }}
            />
            <span className="text-sm text-text-secondary">
              Scenario {entry.scenario}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default CashFlowChart;
