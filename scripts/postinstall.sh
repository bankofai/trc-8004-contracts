#!/bin/bash
set -e  

echo "Cloning forge-std..."
git clone --branch v1.12.0 --depth 1 https://github.com/foundry-rs/forge-std ./lib/forge-std

echo "Cloning openzeppelin-contracts..."
git clone --branch v5.5.0 --depth 1 https://github.com/OpenZeppelin/openzeppelin-contracts ./lib/openzeppelin-contracts

echo "✅ All repositories cloned successfully."
