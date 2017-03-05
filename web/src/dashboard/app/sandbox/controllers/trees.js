'use strict'
import angular from 'angular'

function SandboxTreesCtrl ($scope, $timeout) {
  let tree
  let treedataAvm
  let treedataGeography

  $scope.myTreeHandler = (branch) => {
    let _ref
    $scope.output = `You selected: ${branch.label}`
    if ((_ref = branch.data) !== null ? _ref.description : void 0) {
      const res = $scope.output += `(${branch.data.description})`
      return res
    }
  }

  let appleSelected = (branch) => {
    $scope.output = `APPLE! : ${branch.label}`
    return $scope.output
  }

  treedataAvm = [ {
    label: 'Animal',
    children: [ {
      label: 'Dog',
      data: {
        description: 'man\'s best friend',
      },
    }, {
      label: 'Cat',
      data: {
        description: 'Felis catus',
      },
    }, {
      label: 'Hippopotamus',
      data: {
        description: 'hungry, hungry',
      },
    }, {
      label: 'Chicken',
      children: [
        'White Leghorn',
        'Rhode Island Red',
        'Jersey Giant',
      ],
    } ],
  }, {
    label: 'Vegetable',
    data: {
      definition: 'A plant or part of a plant used as food, typically as accompaniment to meat or fish, ' +
      'such as a cabbage, potato, carrot, or bean.',
      dataCanContainAnything: true,
    },
    onSelect: (branch) => {
      $scope.output = `Vegetable: ${branch.data.definition}`
      return $scope.output
    },
    children: [ {
      label: 'Oranges',
    }, {
      label: 'Apples',
      children: [ {
        label: 'Granny Smith',
        onSelect: appleSelected,
      }, {
        label: 'Red Delicous',
        onSelect: appleSelected,
      }, {
        label: 'Fuji',
        onSelect: appleSelected,
      } ],
    } ],
  }, {
    label: 'Mineral',
    children: [ {
      label: 'Rock',
      children: [
        'Igneous',
        'Sedimentary',
        'Metamorphic',
      ],
    }, {
      label: 'Metal',
      children: [
        'Aluminum',
        'Steel',
        'Copper',
      ],
    }, {
      label: 'Plastic',
      children: [ {
        label: 'Thermoplastic',
        children: [
          'polyethylene',
          'polypropylene',
          'polystyrene',
          'polyvinyl chloride',
        ],
      }, {
        label: 'Thermosetting Polymer',
        children: [
          'polyester',
          'polyurethane',
          'vulcanized rubber',
          'bakelite',
          'urea-formaldehyde',
        ],
      } ],
    } ],
  } ]

  treedataGeography = [ {
    label: 'North America',
    children: [ {
      label: 'Canada',
      children: [
        'Toronto',
        'Vancouver',
      ],
    }, {
      label: 'USA',
      children: [
        'New York',
        'Los Angeles',
      ],
    }, {
      label: 'Mexico',
      children: [
        'Mexico City',
        'Guadalajara',
      ],
    } ],
  }, {
    label: 'South America',
    children: [ {
      label: 'Venezuela',
      children: [
        'Caracas',
        'Maracaibo',
      ],
    }, {
      label: 'Brazil',
      children: [
        'Sao Paulo',
        'Rio de Janeiro',
      ],
    }, {
      label: 'Argentina',
      children: [
        'Buenos Aires',
        'Cordoba',
      ],
    } ],
  } ]

  $scope.myTreeData = treedataAvm
  $scope.tryChangingTheTreeData = () => {
    if ($scope.myTreeData === treedataAvm) {
      $scope.myTreeData = treedataGeography
      return $scope.myTreeData
    } else {
      $scope.myTreeData = treedataAvm
      return $scope.myTreeData
    }
  }
  $scope.myTree = tree = {}
  $scope.tryAsyncLoad = () => {
    $scope.myTreeData = []
    $scope.doingAsync = true
    return $timeout(() => {
      if (Math.random() < 0.5) {
        $scope.myTreeData = treedataAvm
      } else {
        $scope.myTreeData = treedataGeography
      }
      $scope.doingAsync = false
      return tree.expandAll()
    }, 1000)
  }
  $scope.tryAddingABranch = () => {
    let b
    b = tree.getSelectedBranch()
    return tree.addBranch(b, {
      label: 'New Branch',
      data: {
        something: 42,
        'else': 43,
      },
    })
  }
  return $scope.tryAddingABranch
}

angular
  .module('com.module.sandbox.controllers.trees', [])
  .controller('SandboxTreesCtrl', SandboxTreesCtrl)
