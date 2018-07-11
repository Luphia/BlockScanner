# BlockScanner
Blockchain Data Collector

## Install
```shell
sudo npm install bc2 -g
```
```shell
sudo npm install bc2 -g --unsafe-perm
```

## Setup Config
```shell
vi ~/bc2.config.toml
```

```file
# BlockScanner Default Config

title = "BlockScanner"

[base]
folder = "/path/to/your/chaindata"

[blockchain]
protocol = "http:"
hostname = "127.0.0.1"
port = 8545
path = "/"

[database]
protocol = "mongodb:"
hostname = "127.0.0.1"
port = 27012
db = "ETH"
prefix = "BS_"
user = "BC2"
password = "db password"
```

## Run
- start from block 0
```shell
bc2 -c ~/bc2.config.toml
```

- scan N blocks from block M
```shell
bc2 -c ~/bc2.config.toml -f M -o N
```

- list all process
```shell
bc2 -l
```

- kill process X
```shell
bc2 -k X
```

- kill all process
```shell
bc2 -k 0
```