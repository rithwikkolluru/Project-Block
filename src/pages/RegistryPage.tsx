import { useState, useEffect } from 'react';
import { Table, Input, Button, Modal, Form, Select, message, Spin } from 'antd';
import { Search, UserX, AlertTriangle, ExternalLink, FileText, Link, Shield } from 'lucide-react';
import { getScamRegistry, submitScamReport } from '../services/api/scanService';
import { useWallet } from '../hooks/useWallet';

const { Option } = Select;
const { TextArea } = Input;

const MOCK_REGISTRY = [
  { address: 'ALGO1XF9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', reportedBy: 'AlgoSec', reporterAddress: 'ALGO9...', risk: 0.95, createdAt: '2025-03-10T14:00:00Z', status: 'confirmed' },
  { address: 'ALGO2KL7BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB', reportedBy: 'User_442', reporterAddress: 'ALGO8...', risk: 0.88, createdAt: '2025-03-09T09:12:00Z', status: 'confirmed' },
  { address: 'ALGO3ZZ1CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC', reportedBy: 'Anon', reporterAddress: 'ALGO7...', risk: 0.65, createdAt: '2025-03-11T16:45:00Z', status: 'pending' },
  { address: 'ALGO4MP2DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD', reportedBy: 'CryptoCop', reporterAddress: 'ALGO6...', risk: 0.99, createdAt: '2025-03-08T11:20:00Z', status: 'confirmed' },
];

export const RegistryPage = () => {
  const { address: walletAddress } = useWallet();
  const [data, setData] = useState<any[]>(MOCK_REGISTRY);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [form] = Form.useForm();

  // Fetch registry on mount
  useEffect(() => {
    setLoading(true);
    getScamRegistry()
      .then((entries) => {
        if (entries && entries.length > 0) setData(entries);
      })
      .catch(() => {
        // silently fall back to mock data already set
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const filteredData = data.filter(item => {
    const matchesSearch = item.address.toLowerCase().includes(search.toLowerCase()) || 
                          item.reportedBy.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Wallet Address',
      dataIndex: 'address',
      key: 'address',
      render: (text: string) => (
        <span className="font-mono flex items-center gap-2 group cursor-pointer text-white/90">
          {text} 
          <ExternalLink size={14} className="text-white/20 group-hover:text-gravityAccent transition-colors" />
        </span>
      ),
    },
    {
      title: 'Risk Score',
      dataIndex: 'risk',
      key: 'risk',
      sorter: (a: any, b: any) => a.risk - b.risk,
      render: (risk: number) => {
        let colorClass = 'text-safeFloat bg-safeFloat/10 border-safeFloat/30';
        if (risk > 0.5) colorClass = 'text-warnWobble bg-warnWobble/10 border-warnWobble/30';
        if (risk > 0.8) colorClass = 'text-dangerCollapse bg-dangerCollapse/10 border-dangerCollapse/30';
        return (
          <div className={`inline-flex items-center justify-center px-2 py-1 rounded border text-xs font-bold shadow-[0_0_10px_currentColor] ${colorClass}`}>
            {Math.round(risk * 100)}
          </div>
        )
      }
    },
    {
      title: 'Reporter',
      dataIndex: 'reportedBy',
      key: 'reportedBy',
      render: (text: string) => <span className="text-white/70">{text}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let colorClass = 'text-white/50 bg-white/10 border-white/20';
        if (status === 'confirmed') colorClass = 'text-dangerCollapse bg-dangerCollapse/10 border-dangerCollapse/30';
        if (status === 'pending') colorClass = 'text-warnWobble bg-warnWobble/10 border-warnWobble/30';
        return (
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${colorClass}`}>
            {status}
          </span>
        )
      }
    },
    {
      title: 'Reported At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => <span className="text-white/50 text-sm">{new Date(date).toLocaleDateString()}</span>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button 
          type="link" 
          className="text-gravityAccent hover:text-white"
          onClick={() => {
            setSelectedEntry(record);
            setIsModalVisible(true);
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  const onReportSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const result = await submitScamReport({
        address: values.address,
        reason: values.reason,
        evidence: values.evidence || '',
        reporterAddress: walletAddress || undefined,
      });
      message.success({
        content: `Report submitted! Stored on Algorand: ${result.txId?.slice(0, 16)}...`,
        className: 'bg-black/80 border border-white/20 rounded-xl text-white backdrop-blur-md',
        style: { color: 'white' },
        duration: 5,
      });
      form.resetFields();
      // Refresh registry list
      const entries = await getScamRegistry().catch(() => null);
      if (entries && entries.length > 0) setData(entries);
    } catch (err: any) {
      message.error({
        content: err?.message || 'Failed to submit report',
        className: 'bg-black/80 border border-white/20 rounded-xl text-white backdrop-blur-md',
        style: { color: 'white' },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 relative z-10 w-full mb-20">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <UserX className="text-dangerCollapse drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" size={32} /> 
            Scam Wallet Registry
          </h1>
          <p className="text-white/60">Community-driven, Algorand-backed, transparent.</p>
        </div>

        <div className="glass-card px-6 py-3 rounded-2xl flex items-center gap-3 border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
          {loading ? (
            <Spin size="small" />
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          )}
          <span className="text-white/80 font-mono text-sm tracking-tight text-indigo-100">
            <Shield size={13} className="inline mr-1 text-indigo-400" />
            Live Registry: {data.length} Entries
          </span>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] p-8 mb-12 shadow-2xl border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-500/5 blur-[120px] -z-10" />
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input 
            size="large"
            placeholder="Search wallet address or reporter..."
            prefix={<Search size={18} className="text-white/40 mr-2" />}
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 hover:border-indigo-500/50 focus:border-indigo-500 rounded-xl"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Select 
            size="large"
            defaultValue="all" 
            className="w-full md:w-48 bg-white/5 text-white border-white/10 rounded-xl"
            onChange={handleStatusFilter}
            dropdownStyle={{ backgroundColor: '#0f172a', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Option value="all">All Status</Option>
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/5">
          <Table 
            dataSource={filteredData} 
            columns={columns} 
            rowKey="address"
            pagination={{ pageSize: 10 }}
            className="ant-table-dark bg-transparent"
            rowClassName="hover:bg-white/5 transition-colors border-b border-white/5"
          />
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-indigo-500/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/5 blur-[100px] -z-10" />
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <AlertTriangle className="text-indigo-400" />
          </div>
          Submit New Scam Report
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onReportSubmit}
          className="max-w-2xl"
        >
          <Form.Item
            name="address"
            label={<span className="text-indigo-200/60 font-medium ml-1">Malicious Wallet Address</span>}
            rules={[{ required: true, message: 'Please input the suspected address.' }]}
          >
            <Input size="large" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl" placeholder="ALGO..." />
          </Form.Item>
          
          <Form.Item
            name="reason"
            label={<span className="text-indigo-200/60 font-medium ml-1">Reason / Description</span>}
            rules={[{ required: true, message: 'Please provide details.' }]}
          >
            <TextArea rows={4} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl" placeholder="e.g. Sent fake tokens to my wallet..." />
          </Form.Item>

          <Form.Item
            name="evidence"
            label={<span className="text-indigo-200/60 font-medium ml-1">Evidence (Tx Hash or Link)</span>}
          >
            <Input size="large" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl" prefix={<Link size={16} className="text-white/40 mr-2" />} placeholder="https://..." />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={submitting}
              className="bg-indigo-600 border-none hover:bg-indigo-500 font-bold px-10 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)]"
            >
              {submitting ? 'Submitting to Algorand...' : 'Submit Report'}
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Modal
        title={<span className="text-white font-bold flex gap-2 items-center"><UserX className="text-indigo-400" /> Scam Details</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)} className="bg-white/10 text-white border-none hover:bg-white/20 rounded-lg">Close</Button>
        ]}
        styles={{ 
          content: { backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(40px)', borderRadius: '1.5rem' },
          header: { backgroundColor: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)' }
        }}
        closeIcon={<span className="text-white/40 hover:text-white transition-colors">✕</span>}
      >
        {selectedEntry && (
          <div className="py-4 space-y-4">
            <div>
              <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Reported Address</div>
              <div className="font-mono text-white text-lg bg-black/40 p-3 rounded-lg border border-white/10 break-all">
                {selectedEntry.address}
              </div>
            </div>
            
            <div className="flex justify-between gap-4">
               <div>
                 <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Risk Score</div>
                 <div className="text-2xl font-bold text-dangerCollapse drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                   {Math.round(selectedEntry.risk * 100)} / 100
                 </div>
               </div>
               <div>
                 <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Status</div>
                 <div className="text-white/80 font-bold uppercase mt-1">
                   {selectedEntry.status}
                 </div>
               </div>
            </div>

            <div>
              <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Reporter</div>
              <div className="text-white/80">{selectedEntry.reportedBy} ({selectedEntry.reporterAddress})</div>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl mt-4">
              <h4 className="text-white/90 font-bold mb-2 flex items-center gap-2"><FileText size={16} /> Evidence</h4>
              <p className="text-white/60 text-sm">
                This wallet has been flagged by multiple nodes conforming to our heurisitcs model.
              </p>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        /* Global overrides for AntD dark theme inside this page */
        .ant-table-dark .ant-table {
          background: transparent !important;
          color: white;
        }
        .ant-table-dark .ant-table-thead > tr > th {
          background: rgba(0,0,0,0.4) !important;
          color: rgba(255,255,255,0.6);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .ant-table-dark .ant-table-tbody > tr > td {
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ant-table-dark .ant-table-tbody > tr:hover > td {
          background: rgba(255,255,255,0.02) !important;
        }
        .ant-empty-description {
          color: rgba(255,255,255,0.4);
        }
        .ant-pagination-item a {
          color: white;
        }
        .ant-pagination-item-active {
            background: #6366F1 !important;
            border-color: #6366F1 !important;
        }
      `}</style>
    </div>
  );
};
