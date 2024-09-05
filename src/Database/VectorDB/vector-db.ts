import { MilvusClient, DataType } from '@zilliz/milvus2-sdk-node';

let milvusClient: MilvusClient;

const dropCollection = async () => {
  try {
    await milvusClient.dropCollection({
      collection_name: 'user_intervals_embedding',
    });
  } catch (error) {
    console.error('Failed to drop collection:', error);
  }
};

const createCollection = async () => {
  try {
    await milvusClient.createCollection({
      collection_name: 'user_intervals_embedding',
      auto_id: true,
      fields: [
        {
          name: 'id',
          description: 'ID',
          data_type: DataType.Int64,
          is_primary_key: true,
          autoID: true,
        },
        {
          name: 'userId',
          description: 'User ID',
          data_type: DataType.VarChar,
          max_length: 64,
        },
        {
          name: 'startFootprintId',
          description: 'Start Footprint ID',
          data_type: DataType.VarChar,
          max_length: 64,
        },
        {
          name: 'endFootprintId',
          description: 'End Footprint ID',
          data_type: DataType.VarChar,
          max_length: 64,
        },
        {
          name: 'embedding',
          description: 'Embedding Vector',
          data_type: DataType.FloatVector,
          dim: 768,
        },
      ],
    });
  } catch (error) {
    console.error('Failed to create collection:', error);
  }
};

const createIndex = async () => {
  try {
    await milvusClient.createIndex({
      collection_name: 'user_intervals_embedding',
      field_name: 'embedding',
      index_type: 'IVF_FLAT',
      metric_type: 'COSINE',
      params: {
        nlist: 16384,
      },
    });
  } catch (error) {
    console.error('Failed to create index:', error);
  }
};

const loadCollection = async () => {
  try {
    await milvusClient.loadCollection({
      collection_name: 'user_intervals_embedding',
    });
  } catch (error) {
    console.error('Failed to load collection:', error);
  }
};

const initMilvus = async (resetDB: boolean) => {
  milvusClient = new MilvusClient({
    address: `${process.env.MILVUS_HOST}:${process.env.MILVUS_GRPC_PORT}`,
    username: `${process.env.MILVUS_ROOT_USERNAME}`,
    password: `${process.env.MILVUS_ROOT_PASSWORD}`,
  });

  const hasCollection = await milvusClient.hasCollection({
    collection_name: 'user_intervals_embedding',
  });

  if (hasCollection.value && resetDB) {
    await dropCollection();
  }

  if (!hasCollection.value || resetDB) {
    await createCollection();
    await createIndex();
    await loadCollection();
  }

  return milvusClient;
};

async function getAllMilvusData() {
  try {
    const milvusClient = getMilvusClient();
    const res = await milvusClient.query({
      collection_name: 'user_intervals_embedding',
      filter: "userId != '0'",
      output_fields: ['id', 'userId', 'startFootprintId', 'endFootprintId'],
    });

    return res.data;
  } catch (error) {
    console.error('Failed to get Milvus data:', error);
  }
}

const getMilvusClient = () => {
  if (!milvusClient) {
    throw new Error('Milvus client is not initialized.');
  }

  return milvusClient;
};

export { initMilvus, getMilvusClient, getAllMilvusData };
