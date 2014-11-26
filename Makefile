
TAG_VERSION = $(shell cat package.json | grep version | awk -F'"' '{print $$4}')

publish:
	@npm publish
	@git tag $(TAG_VERSION)
	@git push origin $(TAG_VERSION)

push:
	@git push origin master