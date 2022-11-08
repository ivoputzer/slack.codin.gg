all: build save deploy

build:
	docker build --tag ${tag} .

# github workflows usage:
#
# make build tag=${{ github.event.repository.name }}

# development usage:
#
# make build tag=(
#		basename (git remote get-url origin) .git
#	)
#
# ```make build tag=(basename (git remote-url origin))```

save:
	docker save -o ${sha}.tar ${tag}

# github workflows usage:
#
# make save tag=${{ github.event.repository.name }} sha=${{ github.sha }}

# development usage:
#
# make save
# tag=(
#		basename (
#			(git remote get-url origin) .git
#		)
#	)
# sha=(
#		git rev-parse --verify --short head
# )
#
# ```make save tag=(basename (git remote-url origin)) sha=(git rev-parse --verify --short head)```


deploy:
	ansible-playbook --user="ubuntu" --extra-vars="github_sha=${sha} github_repository_name=${tag} slack_token=${slack_token} slack_secret=${slack_secret} openai_secret=${openai_secret}" --inventory ${tag}, deploy.yml  -vvvv

	# gotcha: ssh-agent needs to have a key loaded to be using ubuntu user on the server

	# --ssh-common-args="-o StrictHostKeyChecking=no -o PreferredAuthentications=publickey"
	# --become --become-user="root" --private-key="~/.ssh/codin_rsa"
