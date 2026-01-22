'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { Project } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/calculations';

// Using built-in Helvetica font family to avoid font embedding issues

const colors = {
  navy: '#0A1628',
  charcoal: '#1E293B',
  slate: '#334155',
  gold: '#D4A853',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  success: '#2DD4BF',
  warning: '#FBBF24',
  danger: '#F87171',
  white: '#FFFFFF',
  black: '#000000',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    padding: 40,
    fontFamily: 'Helvetica',
  },
  coverPage: {
    backgroundColor: colors.navy,
    padding: 0,
    fontFamily: 'Helvetica',
  },
  coverContent: {
    flex: 1,
    padding: 60,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 42,
    fontWeight: 700,
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  goldLine: {
    width: 60,
    height: 3,
    backgroundColor: colors.gold,
    marginTop: 12,
    marginBottom: 40,
  },
  coverTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  coverDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 40,
  },
  decorativeLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.gold,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLogo: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.navy,
  },
  headerPage: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.navy,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.gold,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.navy,
    marginBottom: 10,
    marginTop: 20,
  },
  text: {
    fontSize: 11,
    color: colors.slate,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 600,
    color: colors.navy,
  },
  recommendationBox: {
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  recommendationProceed: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: colors.success,
  },
  recommendationOptimise: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: colors.warning,
  },
  recommendationExit: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 11,
    lineHeight: 1.6,
  },
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.navy,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: 600,
    color: colors.white,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableRowAlt: {
    backgroundColor: '#F9FAFB',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: colors.slate,
    textAlign: 'center',
  },
  tableCellLabel: {
    flex: 1.5,
    fontSize: 10,
    color: colors.slate,
    textAlign: 'left',
  },
  scenarioCard: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  scenarioRecommended: {
    borderColor: colors.gold,
    borderWidth: 2,
  },
  scenarioTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.navy,
    marginBottom: 4,
  },
  scenarioName: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  metricValue: {
    fontSize: 10,
    fontWeight: 600,
    color: colors.navy,
  },
  riskItem: {
    flexDirection: 'row',
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
  },
  riskBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
    marginTop: 4,
  },
  riskHigh: {
    backgroundColor: colors.danger,
  },
  riskMedium: {
    backgroundColor: colors.warning,
  },
  riskLow: {
    backgroundColor: colors.textSecondary,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.gold,
  },
  footerText: {
    fontSize: 8,
    color: colors.textSecondary,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  infoItem: {
    width: '50%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 11,
    color: colors.navy,
    fontWeight: 600,
  },
});

interface Props {
  project: Project;
}

export function ReportDocument({ project }: Props) {
  const { results } = project;

  if (!results) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getRecommendationStyle = () => {
    switch (results.recommendation) {
      case 'Proceed':
        return styles.recommendationProceed;
      case 'Optimise':
        return styles.recommendationOptimise;
      case 'Exit':
        return styles.recommendationExit;
    }
  };

  const getRecommendationColor = () => {
    switch (results.recommendation) {
      case 'Proceed':
        return colors.success;
      case 'Optimise':
        return colors.warning;
      case 'Exit':
        return colors.danger;
    }
  };

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverContent}>
          <Text style={styles.logo}>Clarion</Text>
          <View style={styles.goldLine} />
          <Text style={styles.coverTitle}>Investment Feasibility Analysis</Text>
          <Text style={styles.coverSubtitle}>{project.name}</Text>
          <Text style={styles.coverSubtitle}>{project.address}, {project.city}</Text>
          <Text style={styles.coverDate}>
            Generated: {formatDate(results.generatedAt)}
          </Text>
        </View>
        <View style={styles.decorativeLine} />
      </Page>

      {/* Executive Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Clarion</Text>
          <Text style={styles.headerPage}>Executive Summary</Text>
        </View>

        <Text style={styles.sectionTitle}>Executive Summary</Text>

        <View style={[styles.recommendationBox, getRecommendationStyle()]}>
          <Text style={[styles.recommendationTitle, { color: getRecommendationColor() }]}>
            Recommendation: {results.recommendation}
          </Text>
          <Text style={styles.recommendationText}>
            {results.recommendationSummary}
          </Text>
        </View>

        <Text style={styles.subsectionTitle}>Property Overview</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Property Type</Text>
            <Text style={styles.infoValue}>{project.propertyType}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Size</Text>
            <Text style={styles.infoValue}>{project.size.toLocaleString()} sqm</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Year Built</Text>
            <Text style={styles.infoValue}>{project.yearBuilt}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{project.city}</Text>
          </View>
        </View>

        <Text style={styles.subsectionTitle}>Key Metrics at a Glance</Text>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          {(['A', 'B', 'C'] as const).map((id) => {
            const scenario = results.scenarios[id];
            const isRecommended = results.recommendedScenario === id;
            return (
              <View
                key={id}
                style={isRecommended ? [styles.scenarioCard, styles.scenarioRecommended] : styles.scenarioCard}
              >
                <Text style={styles.scenarioTitle}>Scenario {id}</Text>
                <Text style={styles.scenarioName}>{scenario.name}</Text>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Capital</Text>
                  <Text style={styles.metricValue}>
                    {formatCurrency(scenario.capitalRequired)}
                  </Text>
                </View>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>IRR</Text>
                  <Text style={styles.metricValue}>
                    {formatPercentage(scenario.irr)}
                  </Text>
                </View>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Risk</Text>
                  <Text style={styles.metricValue}>{scenario.riskRating}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Clarion | Confidential</Text>
          <Text style={styles.footerText}>Page 2</Text>
        </View>
      </Page>

      {/* Scenario Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Clarion</Text>
          <Text style={styles.headerPage}>Scenario Analysis</Text>
        </View>

        <Text style={styles.sectionTitle}>Scenario Analysis</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 1.5, textAlign: 'left' }]}>
              Metric
            </Text>
            <Text style={styles.tableHeaderCell}>Scenario A</Text>
            <Text style={styles.tableHeaderCell}>Scenario B</Text>
            <Text style={styles.tableHeaderCell}>Scenario C</Text>
          </View>
          {[
            { label: 'Capital Expenditure', a: formatCurrency(results.scenarios.A.capitalRequired), b: formatCurrency(results.scenarios.B.capitalRequired), c: formatCurrency(results.scenarios.C.capitalRequired) },
            { label: 'Annual Net Income', a: formatCurrency(results.scenarios.A.projectedAnnualIncome), b: formatCurrency(results.scenarios.B.projectedAnnualIncome), c: formatCurrency(results.scenarios.C.projectedAnnualIncome) },
            { label: 'Net Initial Yield', a: formatPercentage(results.scenarios.A.netYield), b: formatPercentage(results.scenarios.B.netYield), c: formatPercentage(results.scenarios.C.netYield) },
            { label: 'IRR (10-year)', a: formatPercentage(results.scenarios.A.irr), b: formatPercentage(results.scenarios.B.irr), c: formatPercentage(results.scenarios.C.irr) },
            { label: 'Payback Period', a: `${results.scenarios.A.paybackPeriod.toFixed(1)} yrs`, b: `${results.scenarios.B.paybackPeriod.toFixed(1)} yrs`, c: `${results.scenarios.C.paybackPeriod.toFixed(1)} yrs` },
            { label: 'EPC Rating', a: results.scenarios.A.epcRatingAchieved, b: results.scenarios.B.epcRatingAchieved, c: results.scenarios.C.epcRatingAchieved },
            { label: 'MEES Compliant', a: results.scenarios.A.meesCompliant ? 'Yes' : 'No', b: results.scenarios.B.meesCompliant ? 'Yes' : 'No', c: results.scenarios.C.meesCompliant ? 'Yes' : 'No' },
            { label: 'Timeline', a: `${results.scenarios.A.timeline} months`, b: `${results.scenarios.B.timeline} months`, c: `${results.scenarios.C.timeline} months` },
            { label: 'Delivery Risk', a: results.scenarios.A.deliveryRisk, b: results.scenarios.B.deliveryRisk, c: results.scenarios.C.deliveryRisk },
          ].map((row, index) => (
            <View
              key={row.label}
              style={index % 2 === 1 ? [styles.tableRow, styles.tableRowAlt] : styles.tableRow}
            >
              <Text style={styles.tableCellLabel}>{row.label}</Text>
              <Text style={styles.tableCell}>{row.a}</Text>
              <Text style={styles.tableCell}>{row.b}</Text>
              <Text style={styles.tableCell}>{row.c}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Clarion | Confidential</Text>
          <Text style={styles.footerText}>Page 3</Text>
        </View>
      </Page>

      {/* Risk Assessment */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Clarion</Text>
          <Text style={styles.headerPage}>Risk Assessment</Text>
        </View>

        <Text style={styles.sectionTitle}>Risk Assessment</Text>

        <Text style={styles.text}>
          The following key risks and considerations have been identified during the analysis:
        </Text>

        {results.riskFlags.map((flag, index) => {
          const severityStyle = flag.severity === 'high'
            ? styles.riskHigh
            : flag.severity === 'medium'
            ? styles.riskMedium
            : styles.riskLow;
          return (
            <View key={index} style={styles.riskItem}>
              <View style={[styles.riskBullet, severityStyle]} />
              <Text style={[styles.text, { flex: 1, marginBottom: 0 }]}>
                {flag.message}
              </Text>
            </View>
          );
        })}

        <Text style={styles.subsectionTitle}>Scenario Descriptions</Text>

        <Text style={[styles.boldText, { marginTop: 10, marginBottom: 4 }]}>
          Scenario A: {results.scenarios.A.name}
        </Text>
        <Text style={styles.text}>{results.scenarios.A.description}</Text>

        <Text style={[styles.boldText, { marginTop: 10, marginBottom: 4 }]}>
          Scenario B: {results.scenarios.B.name}
        </Text>
        <Text style={styles.text}>{results.scenarios.B.description}</Text>

        <Text style={[styles.boldText, { marginTop: 10, marginBottom: 4 }]}>
          Scenario C: {results.scenarios.C.name}
        </Text>
        <Text style={styles.text}>{results.scenarios.C.description}</Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Clarion | Confidential</Text>
          <Text style={styles.footerText}>Page 4</Text>
        </View>
      </Page>

      {/* ESG Roadmap */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Clarion</Text>
          <Text style={styles.headerPage}>ESG Roadmap</Text>
        </View>

        <Text style={styles.sectionTitle}>ESG Compliance Roadmap</Text>

        <Text style={styles.text}>
          This section outlines the pathway to achieving ESG compliance and improved sustainability performance under the recommended scenario.
        </Text>

        <Text style={styles.subsectionTitle}>EPC Improvement Pathway</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 1.5, textAlign: 'left' }]}>
              Milestone
            </Text>
            <Text style={styles.tableHeaderCell}>Current</Text>
            <Text style={styles.tableHeaderCell}>Target</Text>
            <Text style={styles.tableHeaderCell}>Scenario A</Text>
            <Text style={styles.tableHeaderCell}>Scenario B</Text>
            <Text style={styles.tableHeaderCell}>Scenario C</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>EPC Rating</Text>
            <Text style={styles.tableCell}>{project.inputs.esg?.currentEPCRating || '-'}</Text>
            <Text style={styles.tableCell}>{project.inputs.esg?.targetEPCRating || '-'}</Text>
            <Text style={styles.tableCell}>{results.scenarios.A.epcRatingAchieved}</Text>
            <Text style={styles.tableCell}>{results.scenarios.B.epcRatingAchieved}</Text>
            <Text style={styles.tableCell}>{results.scenarios.C.epcRatingAchieved}</Text>
          </View>
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <Text style={styles.tableCellLabel}>MEES Compliant</Text>
            <Text style={styles.tableCell}>{project.inputs.esg?.meesCompliant ? 'Yes' : 'No'}</Text>
            <Text style={styles.tableCell}>Yes</Text>
            <Text style={styles.tableCell}>{results.scenarios.A.meesCompliant ? 'Yes' : 'No'}</Text>
            <Text style={styles.tableCell}>{results.scenarios.B.meesCompliant ? 'Yes' : 'No'}</Text>
            <Text style={styles.tableCell}>{results.scenarios.C.meesCompliant ? 'Yes' : 'No'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>ESG Score</Text>
            <Text style={styles.tableCell}>-</Text>
            <Text style={styles.tableCell}>{project.inputs.esg?.targetCertification || '-'}</Text>
            <Text style={styles.tableCell}>{results.scenarios.A.esgScore}</Text>
            <Text style={styles.tableCell}>{results.scenarios.B.esgScore}</Text>
            <Text style={styles.tableCell}>{results.scenarios.C.esgScore}</Text>
          </View>
        </View>

        <Text style={styles.subsectionTitle}>Regulatory Timeline</Text>
        <View style={styles.riskItem}>
          <View style={[styles.riskBullet, styles.riskHigh]} />
          <Text style={[styles.text, { flex: 1, marginBottom: 0 }]}>
            MEES 2025: Minimum EPC E required for existing commercial leases
          </Text>
        </View>
        <View style={styles.riskItem}>
          <View style={[styles.riskBullet, styles.riskMedium]} />
          <Text style={[styles.text, { flex: 1, marginBottom: 0 }]}>
            MEES 2027: Minimum EPC C required for new commercial leases (proposed)
          </Text>
        </View>
        <View style={styles.riskItem}>
          <View style={[styles.riskBullet, styles.riskLow]} />
          <Text style={[styles.text, { flex: 1, marginBottom: 0 }]}>
            MEES 2030: Minimum EPC B required for all commercial properties (proposed)
          </Text>
        </View>

        <Text style={styles.subsectionTitle}>Recommended Actions</Text>
        <Text style={styles.text}>
          Based on the recommended Scenario {results.recommendedScenario}, the following ESG-related actions are advised:
        </Text>
        <Text style={styles.text}>
          1. Conduct detailed energy audit to identify quick wins and major interventions required to achieve target EPC rating.
        </Text>
        <Text style={styles.text}>
          2. Prioritise building fabric improvements (insulation, glazing) before mechanical system upgrades for maximum efficiency gains.
        </Text>
        <Text style={styles.text}>
          3. Consider on-site renewable energy generation to reduce operational carbon and improve marketability.
        </Text>
        <Text style={styles.text}>
          4. Implement smart building controls and sub-metering to enable ongoing energy management and reporting.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Clarion | Confidential</Text>
          <Text style={styles.footerText}>Page 5</Text>
        </View>
      </Page>

      {/* Appendix - Input Data */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Clarion</Text>
          <Text style={styles.headerPage}>Appendix</Text>
        </View>

        <Text style={styles.sectionTitle}>Appendix: Input Data Summary</Text>

        <Text style={styles.subsectionTitle}>Building Information</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Property Name</Text>
            <Text style={styles.infoValue}>{project.name}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{project.address}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>City</Text>
            <Text style={styles.infoValue}>{project.city}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Property Type</Text>
            <Text style={styles.infoValue}>{project.propertyType}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Size</Text>
            <Text style={styles.infoValue}>{project.size.toLocaleString()} sqm</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Year Built</Text>
            <Text style={styles.infoValue}>{project.yearBuilt}</Text>
          </View>
        </View>

        {project.inputs.costs && (
          <>
            <Text style={styles.subsectionTitle}>Financial Inputs</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Current Annual Rent</Text>
                <Text style={styles.infoValue}>
                  {formatCurrency(project.inputs.costs.currentAnnualRent)}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Occupancy Rate</Text>
                <Text style={styles.infoValue}>
                  {project.inputs.costs.currentOccupancyRate}%
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Property Value</Text>
                <Text style={styles.infoValue}>
                  {formatCurrency(project.inputs.costs.currentPropertyValueEstimate)}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Target Yield</Text>
                <Text style={styles.infoValue}>
                  {project.inputs.costs.targetYield}%
                </Text>
              </View>
            </View>
          </>
        )}

        {project.inputs.esg && (
          <>
            <Text style={styles.subsectionTitle}>ESG Profile</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Current EPC Rating</Text>
                <Text style={styles.infoValue}>
                  {project.inputs.esg.currentEPCRating}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>MEES Compliant</Text>
                <Text style={styles.infoValue}>
                  {project.inputs.esg.meesCompliant ? 'Yes' : 'No'}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Target EPC</Text>
                <Text style={styles.infoValue}>
                  {project.inputs.esg.targetEPCRating}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Target Certification</Text>
                <Text style={styles.infoValue}>
                  {project.inputs.esg.targetCertification}
                </Text>
              </View>
            </View>
          </>
        )}

        <Text style={[styles.text, { marginTop: 30, fontSize: 9 }]}>
          This report has been generated by Clarion and is intended for the exclusive use of the
          client. The analysis and recommendations contained herein are based on the input data
          provided and should be validated by qualified professionals before making investment
          decisions.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Clarion | Confidential</Text>
          <Text style={styles.footerText}>Page 6</Text>
        </View>
      </Page>
    </Document>
  );
}

export default ReportDocument;
