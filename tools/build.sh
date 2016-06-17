#! /usr/bin/env bash
set -e

TOOLS_DIR=$(dirname $0)
SRC_DIR="$(dirname $0)/../src"
BUILD_DIR="$(dirname $0)/../build"

echo "Building to $(readlink -f $BUILD_DIR)"

mkdir -p $BUILD_DIR

cp "${SRC_DIR}/prod.html" "${BUILD_DIR}/index.html"
cp "${SRC_DIR}/prod.css" "${BUILD_DIR}/megaman.css"
cp "${SRC_DIR}/prod.js" "${BUILD_DIR}/main.js"

cp -r "${SRC_DIR}/resource" "${BUILD_DIR}/"

node "${TOOLS_DIR}/concat-js.js" > "${BUILD_DIR}/megaman.js"

echo "Build OK"
