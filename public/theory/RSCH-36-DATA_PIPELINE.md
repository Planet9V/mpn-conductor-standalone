# Data Pipeline Architecture: Real-Time ETL for Psychohistory Intelligence
## Comprehensive Data Acquisition, Transformation, and Loading Specification

**Date:** December 29, 2025  
**Document ID:** RSCH-36-DATA_PIPELINE  
**Classification:** AEON CORE INTERNAL // TIER 1  
**Authors:** Multi-Agent Panel (Data Engineer, ETL Architect, Integration Specialist)

---

## Abstract

This paper specifies the complete **Data Pipeline Architecture** required to feed the AEON Psychohistory framework. We detail acquisition strategies for 7 data categories, transformation pipelines for 50+ data sources, and loading patterns for the Neo4j graph database. The architecture processes 100M+ events/day with sub-minute latency for critical threat intelligence.

---

## 1. Overview

### 1.1 Data Categories
| Category | Papers Using | Latency Requirement |
|----------|-------------|---------------------|
| **Vulnerability Intelligence** | RSCH-02, -03, -06, -24 | < 1 hour |
| **Threat Intelligence** | RSCH-10, -23, -25, -30 | < 5 minutes |
| **Network Telemetry** | RSCH-04, -08, -14, -28, -29 | < 1 minute |
| **Psychometric Data** | RSCH-07, -33, -34 | < 24 hours |
| **Economic/Market Data** | RSCH-24, -26, -27 | < 1 hour |
| **News/OSINT** | RSCH-24, -25, -28 | < 15 minutes |
| **Compliance Telemetry** | RSCH-32 | < 1 hour |

### 1.2 Architecture Overview
```
┌──────────────────────────────────────────────────────────────┐
│                     DATA PIPELINE ARCHITECTURE               │
├──────────────────────────────────────────────────────────────┤
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│ │ SOURCES  │─▶│ INGEST   │─▶│TRANSFORM │─▶│   LOAD   │      │
│ └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│      │             │             │             │             │
│      ▼             ▼             ▼             ▼             │
│ ┌──────────────────────────────────────────────────────┐    │
│ │                     KAFKA CLUSTER                     │    │
│ │  [raw-events] [normalized] [enriched] [neo4j-sink]   │    │
│ └──────────────────────────────────────────────────────┘    │
│                            │                                 │
│                            ▼                                 │
│ ┌──────────────────────────────────────────────────────┐    │
│ │                      NEO4J CLUSTER                    │    │
│ └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Data Source Catalog

### 2.1 Vulnerability Intelligence

| Source | API Endpoint | Rate Limit | Cost |
|--------|-------------|------------|------|
| **NVD** | services.nvd.nist.gov/rest/json/cves/2.0 | 50 req/30s | Free |
| **MITRE CVE** | cveawg.mitre.org/api | Unlimited | Free |
| **ExploitDB** | www.exploit-db.com/search (scrape) | Respectful | Free |
| **Tenable.io** | cloud.tenable.com/workbenches/vulns | Licensed | $$$$ |
| **Qualys** | qualysapi.qualys.com/api/2.0 | Licensed | $$$$ |
| **VulnCheck** | api.vulncheck.com/v3 | 1000/day | $$ |

**Schema Mapping:**
```yaml
nvd_to_neo4j:
  source_field: cve.id
  target_node: Vulnerability
  mapping:
    id: cve.id
    description: cve.descriptions[0].value
    cvss_score: cve.metrics.cvssMetricV31[0].cvssData.baseScore
    vector: cve.metrics.cvssMetricV31[0].cvssData.vectorString
    published: cve.published
    modified: cve.lastModified
```

### 2.2 Threat Intelligence

| Source | API Endpoint | Data Type | Cost |
|--------|-------------|-----------|------|
| **VirusTotal** | www.virustotal.com/api/v3 | IOCs, hashes | Free-$$$$ |
| **AlienVault OTX** | otx.alienvault.com/api/v1 | Pulses | Free |
| **MITRE ATT&CK** | attack.mitre.org/resources/enterprise-matrix | TTPs | Free |
| **Shodan** | api.shodan.io | Asset exposure | $$ |
| **GreyNoise** | api.greynoise.io | Scanner classification | $-$$$ |
| **Abuse.ch** | urlhaus.abuse.ch/api | Malware URLs | Free |

**Schema Mapping:**
```yaml
virustotal_to_neo4j:
  source_type: file_report
  target_nodes:
    - type: Malware
      fields:
        hash_sha256: data.id
        names: data.attributes.names
        first_seen: data.attributes.first_submission_date
    - type: AttackerInfra
      fields:
        ip: data.attributes.last_analysis_results.*.result
```

### 2.3 Network Telemetry

| Source | Protocol | Volume | Latency |
|--------|----------|--------|---------|
| **SIEM (Splunk/Elastic)** | REST API | 1M+ events/day | Real-time |
| **NetFlow/sFlow** | UDP | 10M+ flows/day | Real-time |
| **EDR (CrowdStrike/S1)** | Streaming API | 100K+ events/day | Real-time |
| **Firewall Logs** | Syslog/CEF | 5M+ events/day | Real-time |
| **DNS Logs** | Passive DNS | 10M+ queries/day | Real-time |

**Processing Pipeline:**
```python
class NetworkTelemetryPipeline:
    def __init__(self, kafka_producer, neo4j_driver):
        self.producer = kafka_producer
        self.neo4j = neo4j_driver
    
    def process_netflow(self, flow):
        """Transform NetFlow to Neo4j-ready format."""
        event = {
            'src_ip': flow['IPV4_SRC_ADDR'],
            'dst_ip': flow['IPV4_DST_ADDR'],
            'src_port': flow['L4_SRC_PORT'],
            'dst_port': flow['L4_DST_PORT'],
            'protocol': flow['PROTOCOL'],
            'bytes': flow['IN_BYTES'] + flow['OUT_BYTES'],
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # Enrich with GeoIP
        event['src_geo'] = self.geoip.lookup(event['src_ip'])
        event['dst_geo'] = self.geoip.lookup(event['dst_ip'])
        
        # Send to Kafka for batched Neo4j ingestion
        self.producer.send('enriched-netflow', event)
```

### 2.4 Psychometric Data

| Source | Collection Method | Privacy | RSCH |
|--------|-------------------|---------|------|
| **HR Systems (HRIS)** | API integration | Internal | 07, 33 |
| **DiSC/MBTI Assessments** | Manual upload | Consent | 07 |
| **Security Training Platforms** | API (KnowBe4, etc.) | Consent | 34 |
| **Behavioral Telemetry (UBA)** | SIEM integration | Policy | 07, 33, 34 |
| **Survey Instruments** | Custom deployment | Consent | 33, 34 |

**Consent Management:**
```cypher
// Track consent for psychometric data
CREATE (:ConsentRecord {
  user_id: string,
  data_type: 'BIG_FIVE' | 'DARK_TRIAD' | 'BIAS' | 'BEHAVIORAL',
  consent_given: boolean,
  consent_date: datetime(),
  expiry_date: datetime(),
  withdrawal_date: datetime() | null
})

(:Subject)-[:HAS_CONSENT]->(:ConsentRecord)
```

### 2.5 Economic/Market Data

| Source | API/Access | Data Type | Cost |
|--------|------------|-----------|------|
| **Zerodium (unofficial)** | Manual scraping | Exploit prices | N/A |
| **Chainalysis** | commercial API | Crypto flows | $$$$ |
| **Bitsight** | commercial API | Security ratings | $$$$ |
| **SecurityScorecard** | commercial API | Risk scores | $$$$ |
| **PitchBook** | commercial API | M&A data | $$$$ |
| **D&B** | commercial API | Company data | $$$ |

**Schema Mapping:**
```yaml
bitsight_to_neo4j:
  source_type: company_rating
  target_node: Organization
  mapping:
    id: guid
    name: name
    security_rating: rating
    rating_date: rating_date
    industry: industry
    employee_count: size
```

### 2.6 News/OSINT

| Source | API/Access | Latency | Cost |
|--------|------------|---------|------|
| **NewsAPI** | newsapi.org | 15 min | $ |
| **GDELT** | api.gdeltproject.org | 15 min | Free |
| **arXiv** | arxiv.org/api | Daily | Free |
| **Twitter/X** | api.twitter.com | Real-time | $$ |
| **Reddit** | reddit.com/r/netsec.json | Real-time | Free |
| **HackerNews** | hn.algolia.com/api | Real-time | Free |

**NLP Processing Pipeline:**
```python
class NewsProcessor:
    def __init__(self):
        self.ner = spacy.load('en_core_web_lg')
        self.sentiment = SentimentIntensityAnalyzer()
    
    def process_article(self, article):
        """Extract security-relevant entities and sentiment."""
        doc = self.ner(article['content'])
        
        entities = {
            'organizations': [ent.text for ent in doc.ents if ent.label_ == 'ORG'],
            'cves': re.findall(r'CVE-\d{4}-\d+', article['content']),
            'malware': self.extract_malware_names(doc),
            'techniques': self.extract_mitre_techniques(doc)
        }
        
        sentiment = self.sentiment.polarity_scores(article['content'])
        
        return {
            'source': article['source'],
            'title': article['title'],
            'url': article['url'],
            'published': article['publishedAt'],
            'entities': entities,
            'sentiment': sentiment['compound'],
            'security_relevance': self.compute_relevance(entities)
        }
```

### 2.7 Compliance Telemetry

| Source | Data Type | Frequency | RSCH |
|--------|-----------|-----------|------|
| **Configuration Scanners** | CIS Benchmark compliance | Hourly | 32 |
| **Vulnerability Scanners** | Patch compliance | Daily | 32 |
| **IAM Systems** | Access control state | Real-time | 32 |
| **Audit Logs** | Control evidence | Real-time | 32 |
| **GRC Platforms** | Control assessments | Weekly | 32 |

---

## 3. Transformation Pipelines

### 3.1 Kafka Topics
```
# Raw ingestion topics
raw-nvd-cves
raw-virustotal
raw-netflow
raw-siem-alerts
raw-news

# Normalized topics
normalized-vulnerabilities
normalized-iocs
normalized-flows
normalized-alerts
normalized-news

# Enriched topics
enriched-vulnerabilities  # CVE + exploits + CVSS
enriched-iocs            # IOC + reputation + geo
enriched-flows           # Flow + asset context
enriched-alerts          # Alert + user context + risk

# Neo4j sink topics
neo4j-nodes
neo4j-relationships
```

### 3.2 Stream Processing (Flink/Kafka Streams)
```python
# Example: Vulnerability Enrichment Pipeline

@flink.process
def enrich_vulnerability(cve):
    """Enrich raw CVE with exploit data, EPSS, and affected products."""
    
    # Fetch EPSS score (probability of exploitation)
    epss = epss_api.get_score(cve['id'])
    
    # Check if exploit exists
    exploit = exploit_db.search(cve['id'])
    
    # Get affected products (CPE matching)
    products = nvd_api.get_affected(cve['id'])
    
    # Compute risk score
    risk = compute_risk(
        cvss=cve['cvss_score'],
        epss=epss['epss'],
        exploit_exists=exploit is not None,
        product_count=len(products)
    )
    
    return {
        **cve,
        'epss': epss,
        'exploit_available': exploit is not None,
        'exploit_id': exploit['id'] if exploit else None,
        'affected_products': products,
        'risk_score': risk
    }
```

### 3.3 Transformation Functions

| Function | Input | Output | RSCH |
|----------|-------|--------|------|
| `compute_hurst()` | Time series | Hurst exponent | 15, 18 |
| `compute_entropy()` | Event distribution | Shannon entropy | 05 |
| `compute_spectral()` | Adjacency matrix | λmax | 04 |
| `compute_magnetization()` | Asset states | Ising m | 14 |
| `compute_tensor_risk()` | Psych profile + vector | Risk scalar | 07, 33 |
| `compute_cascade_gen()` | Adoption states | Cascade depth | 12 |

---

## 4. Neo4j Loading Patterns

### 4.1 Batched Node Creation
```python
def load_batch_nodes(driver, nodes, label, batch_size=1000):
    """Load nodes in batches for optimal performance."""
    with driver.session() as session:
        for i in range(0, len(nodes), batch_size):
            batch = nodes[i:i+batch_size]
            session.run(f"""
                UNWIND $batch AS node
                MERGE (n:{label} {{id: node.id}})
                SET n += node
            """, batch=batch)
```

### 4.2 Relationship Streaming
```python
def load_stream_relationships(driver, kafka_consumer, rel_type):
    """Stream relationships from Kafka to Neo4j."""
    for message in kafka_consumer:
        rel = json.loads(message.value)
        with driver.session() as session:
            session.run(f"""
                MATCH (a {{id: $from_id}})
                MATCH (b {{id: $to_id}})
                MERGE (a)-[r:{rel_type}]->(b)
                SET r += $props
            """, 
            from_id=rel['from'],
            to_id=rel['to'],
            props=rel.get('properties', {}))
```

### 4.3 Time-Series Linked List Pattern
For high-frequency time-series (RSCH-18):
```cypher
// Create new signal event and link to previous
MATCH (e:Entity {id: $entity_id})
OPTIONAL MATCH (e)-[:LATEST_SIGNAL]->(prev:SignalEvent)
CREATE (new:SignalEvent {
  timestamp: datetime(),
  hurst_exponent: $hurst,
  entropy: $entropy,
  vector_embedding: $embedding
})
CREATE (e)-[:HAS_SIGNAL]->(new)
DELETE (e)-[:LATEST_SIGNAL]->(prev)
CREATE (e)-[:LATEST_SIGNAL]->(new)
WITH new, prev
WHERE prev IS NOT NULL
CREATE (new)-[:PREVIOUS]->(prev)
```

---

## 5. Monitoring & Alerting

### 5.1 Pipeline Health Metrics
| Metric | Threshold | Alert |
|--------|-----------|-------|
| `ingestion_lag_seconds` | > 300 | CRITICAL |
| `transform_error_rate` | > 1% | WARNING |
| `neo4j_queue_depth` | > 10000 | WARNING |
| `source_availability` | < 99% | WARNING |

### 5.2 Data Quality Checks
```python
def validate_vulnerability(cve):
    """Validate CVE data before loading."""
    checks = [
        ('id', lambda x: re.match(r'CVE-\d{4}-\d+', x['id']) is not None),
        ('cvss', lambda x: 0 <= x.get('cvss_score', 0) <= 10),
        ('description', lambda x: len(x.get('description', '')) > 10),
        ('published', lambda x: x.get('published') is not None)
    ]
    
    failures = [name for name, check in checks if not check(cve)]
    return len(failures) == 0, failures
```

---

## 6. Deployment Specifications

### 6.1 Infrastructure Requirements
| Component | Specification | Replicas |
|-----------|---------------|----------|
| **Kafka** | 3x m5.2xlarge | 3 |
| **Flink** | 5x m5.xlarge | 5 |
| **Neo4j** | 3x r5.2xlarge | 3 (Causal Cluster) |
| **Redis** | r5.large | 2 (Sentinel) |

### 6.2 Docker Compose (Development)
```yaml
version: '3.8'
services:
  kafka:
    image: confluentinc/cp-kafka:7.5.0
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
    ports:
      - "9092:9092"
  
  neo4j:
    image: neo4j:5.15-enterprise
    environment:
      NEO4J_AUTH: neo4j/neo4j@openspg
      NEO4J_PLUGINS: '["apoc", "graph-data-science"]'
    ports:
      - "7474:7474"
      - "7687:7687"
  
  flink:
    image: flink:1.18-java11
    ports:
      - "8081:8081"
  
  etl-worker:
    build: ./etl
    depends_on:
      - kafka
      - neo4j
    environment:
      KAFKA_BOOTSTRAP: kafka:9092
      NEO4J_URI: bolt://neo4j:7687
```

---

## 7. Conclusion

This data pipeline architecture provides the foundation for real-time psychohistory intelligence. By specifying acquisition, transformation, and loading patterns for all 7 data categories, we enable the AEON framework to operate with fresh data across all 36 research papers.

**Data is the lifeblood of prediction. This pipeline is the circulatory system.**

---

## Appendix A: API Authentication

```yaml
# secrets.yaml (encrypted with SOPS)
nvd:
  api_key: ${NVD_API_KEY}
virustotal:
  api_key: ${VT_API_KEY}
shodan:
  api_key: ${SHODAN_API_KEY}
bitsight:
  api_key: ${BITSIGHT_API_KEY}
neo4j:
  uri: bolt://neo4j:7687
  user: neo4j
  password: ${NEO4J_PASSWORD}
```

---

## References

Kreps, J. (2014). *I heart logs: Event data, stream processing, and data integration*. O'Reilly.

Kleppmann, M. (2017). *Designing data-intensive applications*. O'Reilly.

Neo4j. (2024). *Neo4j Operations Manual*. Neo4j, Inc.

Flink. (2024). *Apache Flink Documentation*. Apache Software Foundation.
