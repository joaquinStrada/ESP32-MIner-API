const minerParser = minerBD => ({
    id: minerBD.id,
    createdAt: minerBD.created_at,
    name: minerBD.name,
    description: minerBD.description,
    serie: minerBD.serie,
    baseTopic: minerBD.base_topic,
    poolUrl: minerBD.pool_url,
    poolPort: minerBD.pool_port,
    walletAddress: minerBD.wallet_address,
    conected: minerBD.conected
})

export default minerParser