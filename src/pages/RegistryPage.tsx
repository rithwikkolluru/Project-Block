import React, { useState } from 'react';
import { Table, Input, Button, Modal, Form, Select, DatePicker, message } from 'antd';
import { Search, UserX, AlertTriangle, ExternalLink, FileText, Link, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const { Option } = Select;
const { TextArea } = Input;

interface ScamEntry {
  address: string;
  reportedBy: string;
  reporterAddress: string;
  risk: number;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'rejected';
}

const mockRegistryData: ScamEntry[] = [
  { address: 'ALGO1XF9...', reportedBy: 'AlgoSec', reporterAddress: 'ALGO9...', risk: 0.95, createdAt: '2025-03-10T14:00:00Z', status: 'confirmed' },
  { address: 'ALGO2KL7...', reportedBy: 'User_442', reporterAddress: 'ALGO8...', risk: 0.88, createdAt: '2025-03-09T09:12:00Z', status: 'confirmed' },
  { address: 'ALGO3ZZ1...', reportedBy: 'Anon', reporterAddress: 'ALGO7...', risk: 0.65, createdAt: '2025-03-11T16:45:00Z', status: 'pending' },
  { address: 'ALGO4MP2...', reportedBy: 'CryptoCop', reporterAddress: 'ALGO6...', risk: 0.99, createdAt: '2025-03-08T11:20:00Z', status: 'confirmed' }
];

export const RegistryPage = () => {
  const [data, setData] = useState<ScamEntry[]>(mockRegistryData);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ScamEntry | null>(null);
  const [form] = Form.useForm();

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
      sorter: (a: ScamEntry, b: ScamEntry) => a.risk - b.risk,
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
      render: (_: any, record: ScamEntry) => (
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

  const onReportSubmit = (values: any) => {
    console.log('Success:', values);
    message.success({
      content: 'Scam report submitted to Algorand AVM successfully',
      className: 'bg-black/80 border border-white/20 rounded-xl text-white backdrop-blur-md',
      style: { color: 'white' }
    });
    form.resetFields();
    // In a real app, this would append to your state after the smart contract transaction confirms.
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 relative z-10 w-full">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <UserX className="text-dangerCollapse drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" size={32} /> 
            Scam Wallet Registry
          </h1>
          <p className="text-white/60">Community-driven, transparent, secure.</p>
        </div>

        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-safeFloat animate-ping" />
          <span className="text-white/80 font-mono text-sm">Totals: {data.length} Confirmed Scams</span>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl mb-12 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input 
            size="large"
            placeholder="Search wallet address or reporter..."
            prefix={<Search size={18} className="text-white/40 mr-2" />}
            className="flex-1 bg-black/40 border-white/20 text-white placeholder:text-white/40 hover:border-gravityAccent focus:border-gravityAccent"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Select 
            size="large"
            defaultValue="all" 
            className="w-full md:w-48 !bg-black/40 ant-select-dark"
            onChange={handleStatusFilter}
            dropdownStyle={{ backgroundColor: '#1A1A2E', color: 'white' }}
          >
            <Option value="all">All Status</Option>
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
          <DatePicker 
            size="large" 
            className="bg-black/40 border-white/20 hover:border-gravityAccent w-full md:w-auto" 
            placeholder="Date From"
          />
        </div>

        <div className="overflow-x-auto">
          <Table 
            dataSource={filteredData} 
            columns={columns} 
            rowKey="address"
            pagination={{ pageSize: 10, className: 'text-white' }}
            className="ant-table-dark bg-transparent font-sans"
            rowClassName="hover:bg-white/5 transition-colors border-b border-white/5"
          />
        </div>
      </div>

      <div className="bg-black/40 border border-gravityAccent/30 rounded-2xl p-6 md:p-10 backdrop-blur-xl shadow-[0_0_40px_rgba(99,102,241,0.1)]">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <AlertTriangle className="text-gravityAccent" /> Submit New Scam Report
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onReportSubmit}
          className="max-w-2xl"
        >
          <Form.Item
            name="address"
            label={<span className="text-white/80">Malicious Wallet Address</span>}
            rules={[{ required: true, message: 'Please input the suspected address.' }]}
          >
            <Input size="large" className="bg-white/5 border-white/20 text-white placeholder:text-white/30" placeholder="ALGO..." />
          </Form.Item>
          
          <Form.Item
            name="reason"
            label={<span className="text-white/80">Reason / Description</span>}
            rules={[{ required: true, message: 'Please provide details on why this is a scam.' }]}
          >
            <TextArea rows={4} className="bg-white/5 border-white/20 text-white placeholder:text-white/30" placeholder="e.g. Sent fake tokens to my wallet..." />
          </Form.Item>

          <Form.Item
            name="evidence"
            label={<span className="text-white/80">Evidence (Tx Hash or Link)</span>}
          >
            <Input size="large" className="bg-white/5 border-white/20 text-white placeholder:text-white/30" prefix={<Link size={16} className="text-white/40 mr-2" />} placeholder="https://algoexplorer.io/tx/..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" className="bg-gravityAccent border-none hover:bg-gravityAccent/80 font-bold px-8 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              Submit Report to Chain
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Modal
        title={<span className="text-white font-bold flex gap-2 items-center"><UserX /> Scam Details</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)} className="bg-white/10 text-white border-none hover:bg-white/20">Close</Button>
        ]}
        className="dark-modal"
        styles={{ 
          content: { backgroundColor: '#1A1A2E', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' },
          header: { backgroundColor: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.1)' }
        }}
        closeIcon={<span className="text-white hover:text-white/70">X</span>}
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
                This wallet has been flagged by multiple nodes conforming to our Algorand heuristics model. It appears to be linked to the recent Phishing smart contract deployment.
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
